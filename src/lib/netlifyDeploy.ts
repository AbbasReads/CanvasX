import { createZipBlob } from './zip';

export interface NetlifyDeployOptions {
  html: string;
  css: string;
  token?: string;
  siteId?: string;
  customSubdomain?: string;
}

export interface NetlifyDeployResult {
  success: boolean;
  siteId?: string;
  siteName?: string;
  url?: string;
  adminUrl?: string;
  deployUrl?: string;
  error?: string;
}

export interface StoredDeployment {
  siteId: string;
  siteName: string;
  url: string;
  deployedAt: string;
}

export interface ServerProxyStatus {
  available: boolean;
  serverConfigured: boolean;
}

const STORAGE_KEY_TOKEN = 'canvasx_netlify_token';
const STORAGE_KEY_DEPLOYMENT = 'canvasx_netlify_deployment';

/**
 * Checks if the backend proxy (/api/deploy) is available and whether it has a pre-configured Netlify token.
 */
export async function checkServerProxyStatus(): Promise<ServerProxyStatus> {
  if (typeof window === 'undefined') {
    return { available: false, serverConfigured: false };
  }
  try {
    const response = await fetch('/api/deploy', {
      method: 'GET',
      headers: { credentials: 'omit' },
    });
    if (response.ok) {
      const data = await response.json();
      return {
        available: true,
        serverConfigured: Boolean(data.serverConfigured),
      };
    }
  } catch {
    // Backend proxy not reachable (e.g. running purely as static build without server)
  }
  return { available: false, serverConfigured: false };
}

export function getStoredNetlifyToken(): string {
  if (typeof window === 'undefined') return '';
  const fromEnv =
    typeof process !== 'undefined' && process.env?.VITE_NETLIFY_AUTH_TOKEN !== undefined
      ? process.env.VITE_NETLIFY_AUTH_TOKEN
      : (import.meta as any).env?.VITE_NETLIFY_AUTH_TOKEN || '';
  if (fromEnv) return fromEnv;
  return localStorage.getItem(STORAGE_KEY_TOKEN) || '';
}

export function saveStoredNetlifyToken(token: string): void {
  if (typeof window === 'undefined') return;
  if (!token.trim()) {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  } else {
    localStorage.setItem(STORAGE_KEY_TOKEN, token.trim());
  }
}

export function getStoredDeployment(): StoredDeployment | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DEPLOYMENT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredDeployment(dep: StoredDeployment): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_DEPLOYMENT, JSON.stringify(dep));
  } catch {
    // Ignore storage quota errors
  }
}

export function clearStoredDeployment(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_DEPLOYMENT);
}

/**
 * Deploys the generated HTML and CSS to Netlify.
 * Tries the secure server-side proxy (/api/deploy) first to protect credentials.
 * If the server proxy is unavailable, falls back to direct client API with user token.
 */
export async function deployToNetlify(options: NetlifyDeployOptions): Promise<NetlifyDeployResult> {
  // 1. Try server proxy first (secure, server-held secret)
  try {
    const proxyResponse = await fetch('/api/deploy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: options.html,
        css: options.css,
        siteId: options.siteId,
        customSubdomain: options.customSubdomain,
        token: options.token || undefined,
      }),
    });

    // If proxy endpoint exists and responded (even with error status)
    if (proxyResponse.status !== 404 && proxyResponse.status !== 502 && proxyResponse.status !== 503) {
      const data = await proxyResponse.json();
      if (!proxyResponse.ok || !data.success) {
        return {
          success: false,
          error: data.error || `Server proxy returned error (${proxyResponse.status})`,
        };
      }

      if (data.siteId && data.url) {
        saveStoredDeployment({
          siteId: data.siteId,
          siteName: data.siteName || 'academic-portfolio',
          url: data.url,
          deployedAt: new Date().toISOString(),
        });
      }

      return {
        success: true,
        siteId: data.siteId,
        siteName: data.siteName,
        url: data.url,
        adminUrl: data.adminUrl,
        deployUrl: data.deployUrl,
      };
    }
  } catch {
    // Proxy request failed, fallback to client-side direct deploy
  }

  // 2. Fallback: Direct client-side Netlify API call (if user has client token)
  const token = options.token || getStoredNetlifyToken();
  if (!token) {
    return {
      success: false,
      error:
        'Netlify authentication token required. Configure NETLIFY_AUTH_TOKEN on the server or provide a personal access token.',
    };
  }

  try {
    const zipBlob = createZipBlob([
      { name: 'index.html', content: options.html },
      { name: 'styles.css', content: options.css },
    ]);

    let endpoint = 'https://api.netlify.com/api/v1/sites';
    if (options.siteId) {
      endpoint = `https://api.netlify.com/api/v1/sites/${encodeURIComponent(options.siteId)}/deploys`;
    } else if (options.customSubdomain && options.customSubdomain.trim()) {
      const cleanSubdomain = options.customSubdomain
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-');
      endpoint = `https://api.netlify.com/api/v1/sites?name=${encodeURIComponent(cleanSubdomain)}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/zip',
        Authorization: `Bearer ${token}`,
      },
      body: zipBlob,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Netlify deployment failed (HTTP ${response.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) errorMessage = errorJson.message;
        else if (errorJson.errors) errorMessage = JSON.stringify(errorJson.errors);
      } catch {
        if (errorText) errorMessage += `: ${errorText}`;
      }
      return { success: false, error: errorMessage };
    }

    const data = await response.json();
    const siteId = options.siteId || data.id || data.site_id;
    const siteName =
      data.name || (data.ssl_url ? new URL(data.ssl_url).hostname.split('.')[0] : '');
    const liveUrl = data.ssl_url || data.url || `https://${siteName}.netlify.app`;
    const adminUrl =
      data.admin_url || (siteId ? `https://app.netlify.com/sites/${siteName || siteId}` : '');
    const deployUrl = data.deploy_ssl_url || data.deploy_url;

    const result: NetlifyDeployResult = {
      success: true,
      siteId,
      siteName,
      url: liveUrl,
      adminUrl,
      deployUrl,
    };

    if (siteId && liveUrl) {
      saveStoredDeployment({
        siteId,
        siteName: siteName || 'academic-portfolio',
        url: liveUrl,
        deployedAt: new Date().toISOString(),
      });
    }

    return result;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'An unexpected network error occurred while deploying to Netlify.',
    };
  }
}

/**
 * Downloads the portfolio as a standalone ZIP archive for offline hosting or manual upload.
 */
export function downloadPortfolioZip(html: string, css: string, filename = 'academic-portfolio.zip'): void {
  const blob = createZipBlob([
    { name: 'index.html', content: html },
    { name: 'styles.css', content: css },
  ]);

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
