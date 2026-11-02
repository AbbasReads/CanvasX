import type { IncomingMessage, ServerResponse } from 'http';

export function handleAiPipelineProxy(
  req: IncomingMessage,
  res: ServerResponse,
  pipelineUrl = 'http://127.0.0.1:8001'
): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // GET /api/ai/status
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    fetch(`${pipelineUrl}/health`, { method: 'GET' })
      .then(async (backendRes) => {
        if (backendRes.ok) {
          const data = await backendRes.json();
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              connected: true,
              status: data.status || 'healthy',
              service: 'PDF Extraction Engine',
              url: pipelineUrl,
            })
          );
        } else {
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              connected: false,
              status: 'unhealthy',
              url: pipelineUrl,
              error: `Pipeline HTTP ${backendRes.status}`,
            })
          );
        }
      })
      .catch((err) => {
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            connected: false,
            status: 'offline',
            url: pipelineUrl,
            error: err?.message || 'Pipeline service not reachable',
          })
        );
      });
    return;
  }

  // POST /api/ai/extract
  if (req.method === 'POST') {
    const contentType = req.headers['content-type'] || '';

    // Collect binary/raw request body
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });

    req.on('end', async () => {
      res.setHeader('Content-Type', 'application/json');
      const bodyBuffer = Buffer.concat(chunks);

      try {
        const backendRes = await fetch(`${pipelineUrl}/extract-file`, {
          method: 'POST',
          headers: {
            'Content-Type': contentType,
          },
          body: bodyBuffer,
        });

        if (!backendRes.ok) {
          const errText = await backendRes.text();
          let errDetail = `AI Pipeline returned HTTP ${backendRes.status}`;
          try {
            const errJson = JSON.parse(errText);
            if (errJson.detail) errDetail = errJson.detail;
            else if (errJson.error) errDetail = errJson.error;
          } catch {
            if (errText) errDetail += `: ${errText}`;
          }
          res.statusCode = backendRes.status;
          res.end(JSON.stringify({ success: false, error: errDetail }));
          return;
        }

        const data = await backendRes.json();
        res.statusCode = 200;
        res.end(JSON.stringify(data));
      } catch (err: any) {
        res.statusCode = 503;
        res.end(
          JSON.stringify({
            success: false,
            connected: false,
            error:
              'AI/ML Extraction Engine is offline at ' +
              pipelineUrl +
              '. Please ensure the service is running (e.g. uvicorn app.features.pdf_extraction_engine.app:app --port 8001).',
            detail: err?.message,
          })
        );
      }
    });

    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}

