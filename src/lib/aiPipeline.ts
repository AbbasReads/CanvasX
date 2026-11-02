export interface ExtractedPaper {
  title: string;
  authors: string[];
  publication_type?: string;
  publisher?: string;
  year?: number;
  volume?: string;
  issue?: string;
  pages?: string;
  issn?: string;
  isbn?: string;
  confidence_score: number;
}

export interface AiExtractionResponse {
  success: boolean;
  filename?: string;
  papers: ExtractedPaper[];
  error?: string;
  connected?: boolean;
}

export interface AiPipelineStatus {
  connected: boolean;
  status: string;
  url: string;
  error?: string;
}

export interface PublicationItem {
  journal: string;
  year: string;
  title: string;
  authors: string;
  links: Array<{ label: string; href: string }>;
}

export async function checkAiPipelineStatus(): Promise<AiPipelineStatus> {
  try {
    const res = await fetch('/api/ai', { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      return {
        connected: Boolean(data.connected),
        status: data.status || 'unknown',
        url: data.url || 'http://127.0.0.1:8001',
        error: data.error,
      };
    }
  } catch (err: any) {
    // API endpoint unreachable
  }
  return {
    connected: false,
    status: 'offline',
    url: 'http://127.0.0.1:8001',
    error: 'AI service unreachable',
  };
}

export async function extractPublicationsFromPdf(file: File): Promise<AiExtractionResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const response = await fetch('/api/ai/extract', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        papers: [],
        error: data.error || `Extraction failed with HTTP ${response.status}`,
        connected: data.connected !== false,
      };
    }

    return {
      success: true,
      filename: data.filename || file.name,
      papers: Array.isArray(data.papers) ? data.papers : [],
    };
  } catch (err: any) {
    return {
      success: false,
      papers: [],
      error:
        err?.message ||
        'Could not reach AI pipeline. Ensure the Python extraction engine is running at http://127.0.0.1:8001.',
      connected: false,
    };
  }
}

export function mapPaperToPublication(paper: ExtractedPaper): PublicationItem {
  const authorStr =
    Array.isArray(paper.authors) && paper.authors.length > 0
      ? paper.authors.join(', ')
      : 'Author, A.';

  const venue =
    paper.publisher ||
    (paper.publication_type
      ? paper.publication_type.charAt(0).toUpperCase() + paper.publication_type.slice(1)
      : 'Journal / Venue');

  const yearStr = paper.year ? String(paper.year) : String(new Date().getFullYear());

  const links = [{ label: 'PDF', href: '#' }];
  if (paper.pages) {
    links.push({ label: `pp. ${paper.pages}`, href: '#' });
  }

  return {
    journal: venue,
    year: yearStr,
    title: paper.title || 'Untitled Publication',
    authors: authorStr,
    links,
  };
}

/**
 * High-quality sample papers representing output of SciBERT & SciSpacy from an academic CV.
 * Useful for demo/offline preview testing.
 */
export function getSampleDemoPapers(): ExtractedPaper[] {
  return [
    {
      title: 'Scalable Microfinance Protocols in Sub-Saharan Emerging Markets',
      authors: ['Doe, J.', 'Mwangi, P.', 'Kowalski, A.'],
      publication_type: 'journal',
      publisher: 'Quarterly Journal of Development Economics',
      year: 2024,
      volume: '38',
      issue: '2',
      pages: '142-168',
      confidence_score: 0.96,
    },
    {
      title: 'Algorithmic Liquidity Buffers under Extreme Macroeconomic Volatility',
      authors: ['Doe, J.', 'Chen, L.'],
      publication_type: 'conference',
      publisher: 'ACM Conference on Financial Computing and AI',
      year: 2023,
      pages: '89-102',
      confidence_score: 0.92,
    },
    {
      title: 'Cognitive Biases in Sovereign Debt Restructuring Negotiations',
      authors: ['Doe, J.', 'Al-Mansoor, A.', 'Vance, M.'],
      publication_type: 'journal',
      publisher: 'Journal of International Monetary Systems',
      year: 2022,
      volume: '19',
      confidence_score: 0.88,
    },
  ];
}

