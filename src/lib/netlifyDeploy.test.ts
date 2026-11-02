// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  deployToNetlify,
  getStoredNetlifyToken,
  saveStoredNetlifyToken,
  getStoredDeployment,
  saveStoredDeployment,
  clearStoredDeployment,
  checkServerProxyStatus,
} from './netlifyDeploy';

describe('netlifyDeploy module', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.stubEnv('VITE_NETLIFY_AUTH_TOKEN', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses VITE_NETLIFY_AUTH_TOKEN from environment when present', () => {
    vi.stubEnv('VITE_NETLIFY_AUTH_TOKEN', 'env-token-xyz');
    expect(getStoredNetlifyToken()).toBe('env-token-xyz');
  });

  it('manages stored Netlify token in localStorage', () => {
    expect(getStoredNetlifyToken()).toBe('');
    saveStoredNetlifyToken('test-token-123');
    expect(getStoredNetlifyToken()).toBe('test-token-123');
    saveStoredNetlifyToken('');
    expect(getStoredNetlifyToken()).toBe('');
  });

  it('manages stored deployment in localStorage', () => {
    expect(getStoredDeployment()).toBeNull();
    const mockDep = {
      siteId: 'site-xyz',
      siteName: 'jane-doe-site',
      url: 'https://jane-doe-site.netlify.app',
      deployedAt: '2026-10-31T00:00:00.000Z',
    };
    saveStoredDeployment(mockDep);
    expect(getStoredDeployment()).toEqual(mockDep);
    clearStoredDeployment();
    expect(getStoredDeployment()).toBeNull();
  });

  it('checks server proxy status', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'ok', serverConfigured: true }),
    }) as any;

    const status = await checkServerProxyStatus();
    expect(status.available).toBe(true);
    expect(status.serverConfigured).toBe(true);
  });

  it('deploys through server proxy when available', async () => {
    const mockProxyResult = {
      success: true,
      siteId: 'server-site-123',
      siteName: 'prof-smith',
      url: 'https://prof-smith.netlify.app',
      adminUrl: 'https://app.netlify.com/sites/prof-smith',
    };

    global.fetch = vi.fn().mockImplementation(async (url) => {
      if (url === '/api/deploy') {
        return {
          ok: true,
          status: 200,
          json: async () => mockProxyResult,
        };
      }
      return { ok: false, status: 404 };
    }) as any;

    const result = await deployToNetlify({
      html: '<h1>Proxy Test</h1>',
      css: '',
    });

    expect(result.success).toBe(true);
    expect(result.url).toBe('https://prof-smith.netlify.app');
    expect(result.siteId).toBe('server-site-123');

    // Should have saved to localStorage
    const saved = getStoredDeployment();
    expect(saved?.siteId).toBe('server-site-123');
  });

  it('falls back to direct Netlify API when proxy is unavailable', async () => {
    const mockDirectResult = {
      id: 'direct-site-456',
      name: 'direct-site',
      ssl_url: 'https://direct-site.netlify.app',
    };

    global.fetch = vi.fn().mockImplementation(async (url) => {
      if (url === '/api/deploy') {
        return { ok: false, status: 404 };
      }
      return {
        ok: true,
        status: 200,
        json: async () => mockDirectResult,
      };
    }) as any;

    const result = await deployToNetlify({
      html: '<h1>Fallback Test</h1>',
      css: '',
      token: 'client-token-999',
    });

    expect(result.success).toBe(true);
    expect(result.url).toBe('https://direct-site.netlify.app');
  });

  it('fails gracefully when both proxy and client token are missing', async () => {
    global.fetch = vi.fn().mockImplementation(async (url) => {
      if (url === '/api/deploy') {
        return { ok: false, status: 404 };
      }
      return { ok: false, status: 500 };
    }) as any;

    const result = await deployToNetlify({
      html: '<h1>Test</h1>',
      css: 'body {}',
    });
    expect(result.success).toBe(false);
    expect(result.error).toContain('token required');
  });
});
