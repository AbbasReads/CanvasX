import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AiPublicationModal } from './AiPublicationModal';
import * as aiPipeline from '@/lib/aiPipeline';

describe('AiPublicationModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <AiPublicationModal
        isOpen={false}
        onClose={vi.fn()}
        onImportPublications={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly when open and shows initial dropzone', async () => {
    vi.spyOn(aiPipeline, 'checkAiPipelineStatus').mockResolvedValue({
      connected: true,
      status: 'online',
      url: 'http://127.0.0.1:8001',
    });

    render(
      <AiPublicationModal
        isOpen={true}
        onClose={vi.fn()}
        onImportPublications={vi.fn()}
      />
    );

    expect(screen.getByText('AI Publication Extractor')).toBeInTheDocument();
    expect(screen.getByText('Upload Professor CV or Publications PDF')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('AI Pipeline Online')).toBeInTheDocument();
    });
  });

  it('loads demo publications when clicking demo mode button and allows importing', async () => {
    vi.spyOn(aiPipeline, 'checkAiPipelineStatus').mockResolvedValue({
      connected: false,
      status: 'offline',
      url: 'http://127.0.0.1:8001',
    });

    const onImportPublications = vi.fn();
    const onClose = vi.fn();

    render(
      <AiPublicationModal
        isOpen={true}
        onClose={onClose}
        onImportPublications={onImportPublications}
      />
    );

    const demoButton = screen.getByText(/Load Sample Academic CV Extractions/i);
    fireEvent.click(demoButton);

    // After loading demo papers, results screen should show papers
    await waitFor(() => {
      expect(screen.getByText(/Extracted Publications \(3\)/i)).toBeInTheDocument();
    });

    // Check that publications are displayed
    expect(screen.getByText(/Scalable Microfinance Protocols in Sub-Saharan Emerging Markets/i)).toBeInTheDocument();
    expect(screen.getByText(/Algorithmic Liquidity Buffers under Extreme Macroeconomic Volatility/i)).toBeInTheDocument();
    expect(screen.getByText(/Cognitive Biases in Sovereign Debt Restructuring Negotiations/i)).toBeInTheDocument();

    // Import button should reflect 3 selected papers
    const importButton = screen.getByRole('button', { name: /Import 3 Publications/i });
    expect(importButton).toBeInTheDocument();

    // Deselect one paper (e.g. click first card)
    const firstTitle = screen.getByText(/Scalable Microfinance Protocols in Sub-Saharan Emerging Markets/i);
    fireEvent.click(firstTitle);

    // Now 2 selected
    expect(screen.getByRole('button', { name: /Import 2 Publications/i })).toBeInTheDocument();

    // Click import
    fireEvent.click(screen.getByRole('button', { name: /Import 2 Publications/i }));

    expect(onImportPublications).toHaveBeenCalledTimes(1);
    const importedList = onImportPublications.mock.calls[0][0];
    expect(importedList.length).toBe(2);
    expect(importedList[0].title).toBe('Algorithmic Liquidity Buffers under Extreme Macroeconomic Volatility');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
