import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleAiPipelineProxy } from './aiPipelineProxy';
import { EventEmitter } from 'events';

class MockIncomingMessage extends EventEmitter {
  method: string;
  url: string;
  headers: Record<string, string>;

  constructor(method = 'GET', url = '/api/ai/status') {
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

describe('handleAiPipelineProxy', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('checks status and reports connected when backend responds', async () => {
    const req = new MockIncomingMessage('GET', '/api/ai/status');
    const res = new MockServerResponse();

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'healthy', rabbitmq_connected: false }),
    }) as any;

    handleAiPipelineProxy(req as any, res as any, 'http://127.0.0.1:8001');

    await new Promise((r) => setTimeout(r, 20));

    expect(res.statusCode).toBe(200);
    const parsed = JSON.parse(res.data);
    expect(parsed.connected).toBe(true);
    expect(parsed.status).toBe('healthy');
  });

  it('reports offline gracefully when backend is unreachable', async () => {
    const req = new MockIncomingMessage('GET', '/api/ai/status');
    const res = new MockServerResponse();

    global.fetch = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'));

    handleAiPipelineProxy(req as any, res as any, 'http://127.0.0.1:8001');

    await new Promise((r) => setTimeout(r, 20));

    expect(res.statusCode).toBe(200);
    const parsed = JSON.parse(res.data);
    expect(parsed.connected).toBe(false);
    expect(parsed.status).toBe('offline');
  });

  it('proxies file extraction to backend service and returns papers', async () => {
    const req = new MockIncomingMessage('POST', '/api/ai/extract');
    req.headers['content-type'] = 'multipart/form-data; boundary=----boundary';
    const res = new MockServerResponse();

    const mockResponse = {
      success: true,
      filename: 'sample_cv.pdf',
      papers: [
        {
          title: 'Deep Learning in Economics',
          authors: ['Jane Doe', 'Alan Turing'],
          publisher: 'Journal of Economics',
          year: 2024,
          confidence_score: 0.95,
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    }) as any;

    handleAiPipelineProxy(req as any, res as any, 'http://127.0.0.1:8001');

    req.emit('data', Buffer.from('fake pdf data'));
    req.emit('end');

    await new Promise((r) => setTimeout(r, 30));

    expect(res.statusCode).toBe(200);
    const parsed = JSON.parse(res.data);
    expect(parsed.success).toBe(true);
    expect(parsed.papers.length).toBe(1);
    expect(parsed.papers[0].title).toBe('Deep Learning in Economics');
  });
});

