import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleNetlifyProxy } from './netlifyProxy';
import { EventEmitter } from 'events';

class MockIncomingMessage extends EventEmitter {
  method: string;
  url: string;
  headers: Record<string, string>;

  constructor(method = 'GET', url = '/api/deploy') {
    super();
    this.method = method;
    this.url = url;
    this.headers = {};
  }
}

class MockServerResponse {
  statusCode = 200;
  headers: Record<string, string> = {};
  data = '';

  setHeader(key: string, val: string) {
    this.headers[key.toLowerCase()] = val;
  }

  end(content?: string) {
    if (content) this.data = content;
  }
}

describe('handleNetlifyProxy', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('handles GET status check', () => {
    const req = new MockIncomingMessage('GET', '/api/deploy/status');
    const res = new MockServerResponse();

    handleNetlifyProxy(req as any, res as any, 'secret-token-123');

    expect(res.statusCode).toBe(200);
    const parsed = JSON.parse(res.data);
    expect(parsed.serverConfigured).toBe(true);
  });

  it('handles OPTIONS preflight with CORS headers', () => {
    const req = new MockIncomingMessage('OPTIONS', '/api/deploy');
    const res = new MockServerResponse();

    handleNetlifyProxy(req as any, res as any, '');

    expect(res.statusCode).toBe(204);
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });

  it('returns 400 when token is missing both on server and client', async () => {
    const req = new MockIncomingMessage('POST', '/api/deploy');
    const res = new MockServerResponse();

    handleNetlifyProxy(req as any, res as any, '');

    req.emit('data', JSON.stringify({ html: '<h1>Hello</h1>', css: '' }));
    req.emit('end');

    await new Promise((r) => setTimeout(r, 10));

    expect(res.statusCode).toBe(400);
    const parsed = JSON.parse(res.data);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toContain('No Netlify authentication token provided');
  });

  it('proxies deployment using server token and returns result', async () => {
    const req = new MockIncomingMessage('POST', '/api/deploy');
    const res = new MockServerResponse();

    const mockNetlifyResponse = {
      id: 'site-xyz',
      name: 'professor-site',
      ssl_url: 'https://professor-site.netlify.app',
      admin_url: 'https://app.netlify.com/sites/professor-site',
    };

    let capturedHeaders: any = null;
    global.fetch = vi.fn().mockImplementation(async (url, init) => {
      capturedHeaders = init?.headers;
      return {
        ok: true,
        status: 200,
        json: async () => mockNetlifyResponse,
      };
    }) as any;

    handleNetlifyProxy(req as any, res as any, 'server-secret-abc');

    req.emit('data', JSON.stringify({ html: '<h1>Prof. Jane</h1>', css: 'h1 { color: red; }' }));
    req.emit('end');

    await new Promise((r) => setTimeout(r, 20));

    expect(res.statusCode).toBe(200);
    const parsed = JSON.parse(res.data);
    expect(parsed.success).toBe(true);
    expect(parsed.url).toBe('https://professor-site.netlify.app');
    expect(parsed.siteId).toBe('site-xyz');

    // Verify token was used in Authorization header by the server
    expect(capturedHeaders['Authorization']).toBe('Bearer server-secret-abc');
  });
});

