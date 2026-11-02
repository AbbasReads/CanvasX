import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  checkAiPipelineStatus,
  extractPublicationsFromPdf,
  mapPaperToPublication,
  getSampleDemoPapers,
  ExtractedPaper,
} from './aiPipeline';

describe('aiPipeline module', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('maps ExtractedPaper to PublicationItem properly', () => {
    const paper: ExtractedPaper = {
      title: 'Neural Networks in Macroeconomics',
      authors: ['Jane Doe', 'John Nash'],
      publisher: 'American Economic Review',
      year: 2024,
      pages: '100-120',
      confidence_score: 0.95,
      publication_type: 'journal',
    };

    const pub = mapPaperToPublication(paper);
    expect(pub.title).toBe('Neural Networks in Macroeconomics');
    expect(pub.authors).toBe('Jane Doe, John Nash');
    expect(pub.journal).toBe('American Economic Review');
    expect(pub.year).toBe('2024');
    expect(pub.links.length).toBe(2);
    expect(pub.links[0].label).toBe('PDF');
    expect(pub.links[1].label).toBe('pp. 100-120');
  });

  it('handles fallback fields when metadata is sparse', () => {
    const sparsePaper: ExtractedPaper = {
      title: 'A Study on Trade',
      authors: [],
      confidence_score: 0.75,
    };

    const pub = mapPaperToPublication(sparsePaper);
    expect(pub.title).toBe('A Study on Trade');
    expect(pub.authors).toBe('Author, A.');
    expect(pub.journal).toBe('Journal / Venue');
    expect(pub.year).toBe(String(new Date().getFullYear()));
  });

  it('checks status correctly via /api/ai', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ connected: true, status: 'healthy', url: 'http://127.0.0.1:8001' }),
    }) as any;

    const status = await checkAiPipelineStatus();
    expect(status.connected).toBe(true);
    expect(status.status).toBe('healthy');
  });

  it('submits PDF to /api/ai/extract and parses result', async () => {
    const mockPapers = getSampleDemoPapers();

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        filename: 'cv.pdf',
        papers: mockPapers,
      }),
    }) as any;

    const fakeFile = new File(['%PDF-1.4 test'], 'cv.pdf', { type: 'application/pdf' });
    const result = await extractPublicationsFromPdf(fakeFile);

    expect(result.success).toBe(true);
    expect(result.papers.length).toBe(3);
    expect(result.papers[0].title).toContain('Microfinance');
  });
});

