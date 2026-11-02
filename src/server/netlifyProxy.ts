import type { IncomingMessage, ServerResponse } from 'http';
import { createZipArchive } from '../lib/zip';

export interface DeployRequestBody {
  html: string;
  css: string;
  siteId?: string;
  customSubdomain?: string;
  token?: string;
}

export function handleNetlifyProxy(
  req: IncomingMessage,
  res: ServerResponse,
  serverNetlifyToken: string
): void {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const url = req.url || '';

  // GET /api/deploy/status or /api/deploy
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        status: 'ok',
        serverConfigured: Boolean(serverNetlifyToken && serverNetlifyToken.trim()),
      })
    );
    return;
  }

  // POST /api/deploy
  if (req.method === 'POST') {
    let bodyData = '';
    req.on('data', (chunk) => {
      bodyData += chunk;
      // Guard against excessively large payloads (> 20MB)
      if (bodyData.length > 20 * 1024 * 1024) {
        res.statusCode = 413;
        res.end(JSON.stringify({ success: false, error: 'Payload too large' }));
        req.destroy();
      }
    });

    req.on('end', async () => {
      res.setHeader('Content-Type', 'application/json');

      let parsed: DeployRequestBody;
      try {
        parsed = JSON.parse(bodyData);
      } catch {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON request body' }));
        return;
      }

      // Prioritize client override token if supplied, otherwise use server token
      const token = (parsed.token || serverNetlifyToken || '').trim();
      if (!token) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            success: false,
            error:
              'No Netlify authentication token provided. Please configure NETLIFY_AUTH_TOKEN on the server or provide a token in the request.',
          })
        );
        return;
      }

      if (!parsed.html) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: 'HTML content is required for deployment' }));
        return;
      }

      try {
        // Build in-memory zip
        const zipBytes = createZipArchive([
          { name: 'index.html', content: parsed.html },
          { name: 'styles.css', content: parsed.css || '' },
        ]);

        let netlifyEndpoint = 'https://api.netlify.com/api/v1/sites';
        if (parsed.siteId) {
          netlifyEndpoint = `https://api.netlify.com/api/v1/sites/${encodeURIComponent(parsed.siteId)}/deploys`;
        } else if (parsed.customSubdomain && parsed.customSubdomain.trim()) {
          const cleanSub = parsed.customSubdomain
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-');
          netlifyEndpoint = `https://api.netlify.com/api/v1/sites?name=${encodeURIComponent(cleanSub)}`;
        }

        const netlifyResponse = await fetch(netlifyEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/zip',
            Authorization: `Bearer ${token}`,
          },
          body: Buffer.from(zipBytes),
        });

        if (!netlifyResponse.ok) {
          const errorText = await netlifyResponse.text();
          let errorMessage = `Netlify API error (${netlifyResponse.status})`;
          try {
            const errJson = JSON.parse(errorText);
            if (errJson.message) errorMessage = errJson.message;
            else if (errJson.errors) errorMessage = JSON.stringify(errJson.errors);
          } catch {
            if (errorText) errorMessage += `: ${errorText}`;
          }

          res.statusCode = netlifyResponse.status;
          res.end(JSON.stringify({ success: false, error: errorMessage }));
          return;
        }

        const data = await netlifyResponse.json();
        const siteId = parsed.siteId || data.id || data.site_id;
        const siteName =
          data.name || (data.ssl_url ? new URL(data.ssl_url).hostname.split('.')[0] : '');
        const liveUrl = data.ssl_url || data.url || `https://${siteName}.netlify.app`;
        const adminUrl =
          data.admin_url || (siteId ? `https://app.netlify.com/sites/${siteName || siteId}` : '');
        const deployUrl = data.deploy_ssl_url || data.deploy_url;

        res.statusCode = 200;
        res.end(
          JSON.stringify({
            success: true,
            siteId,
            siteName,
            url: liveUrl,
            adminUrl,
            deployUrl,
          })
        );
      } catch (err: any) {
        res.statusCode = 500;
        res.end(
          JSON.stringify({
            success: false,
            error: err?.message || 'Server proxy failed to communicate with Netlify.',
          })
        );
      }
    });

    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}

