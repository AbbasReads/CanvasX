import React, { useState, useEffect, useRef } from 'react';
import {
  checkAiPipelineStatus,
  extractPublicationsFromPdf,
  mapPaperToPublication,
  getSampleDemoPapers,
  ExtractedPaper,
  PublicationItem,
  AiPipelineStatus,
} from '../../lib/aiPipeline';

interface AiPublicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportPublications: (items: PublicationItem[]) => void;
}

export const AiPublicationModal: React.FC<AiPublicationModalProps> = ({
  isOpen,
  onClose,
  onImportPublications,
}) => {
  const [pipelineStatus, setPipelineStatus] = useState<AiPipelineStatus>({
    connected: false,
    status: 'checking',
    url: 'http://127.0.0.1:8001',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [extractedPapers, setExtractedPapers] = useState<ExtractedPaper[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setIsProcessing(false);
      setErrorMessage('');
      setExtractedPapers([]);
      setSelectedIndices(new Set());

      // Check backend status
      checkAiPipelineStatus().then((status) => {
        setPipelineStatus(status);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setErrorMessage('Please select a valid PDF file (e.g. your CV or list of publications).');
        return;
      }
      setSelectedFile(file);
      setErrorMessage('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setErrorMessage('Please drop a valid PDF file.');
        return;
      }
      setSelectedFile(file);
      setErrorMessage('');
    }
  };

  const handleRunExtraction = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMessage('');
    setProcessingStep('Ingesting PDF and segmenting citation boundaries with PyMuPDF...');

    try {
      // Small simulated steps for progress UX
      setTimeout(() => {
        setProcessingStep('Running Scientific Named Entity Recognition with SciSpacy (en_core_sci_lg)...');
      }, 700);

      setTimeout(() => {
        setProcessingStep('Computing SciBERT contextual embeddings & confidence scoring...');
      }, 1500);

      const result = await extractPublicationsFromPdf(selectedFile);

      if (!result.success) {
        setIsProcessing(false);
        setErrorMessage(
          result.error ||
            'Extraction failed. Please verify that the AI/ML service is running at ' + pipelineStatus.url
        );
        return;
      }

      if (!result.papers || result.papers.length === 0) {
        setIsProcessing(false);
        setErrorMessage('No publication citations could be identified in this PDF document.');
        return;
      }

      setExtractedPapers(result.papers);
      // Select all by default
      setSelectedIndices(new Set(result.papers.map((_, i) => i)));
      setIsProcessing(false);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err?.message || 'An error occurred during extraction.');
    }
  };

  const handleLoadDemo = () => {
    setIsProcessing(true);
    setProcessingStep('Loading sample academic publication extractions (SciBERT/SciSpacy demo)...');

    setTimeout(() => {
      const demo = getSampleDemoPapers();
      setExtractedPapers(demo);
      setSelectedIndices(new Set(demo.map((_, i) => i)));
      setIsProcessing(false);
      setErrorMessage('');
    }, 600);
  };

  const toggleSelectPaper = (index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIndices.size === extractedPapers.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(extractedPapers.map((_, i) => i)));
    }
  };

  const handleConfirmImport = () => {
    const chosen = extractedPapers.filter((_, idx) => selectedIndices.has(idx));
    const convertedItems = chosen.map(mapPaperToPublication);
    onImportPublications(convertedItems);
    onClose();
  };

  const formatConfidence = (score: number) => {
    const percent = Math.round(score * 100);
    let colorClass = 'stitch-confidence-badge--high';
    if (percent < 75) colorClass = 'stitch-confidence-badge--medium';
    if (percent < 60) colorClass = 'stitch-confidence-badge--low';
    return <span className={`stitch-confidence-badge ${colorClass}`}>{percent}% confidence</span>;
  };

  return (
    <div className="stitch-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="stitch-modal-card stitch-modal-card--wide" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="stitch-modal-header">
          <div className="stitch-modal-header-title">
            <span className="material-symbols-outlined stitch-modal-icon stitch-modal-icon--purple">
              psychology
            </span>
            <div>
              <h3>AI Publication Extractor</h3>
              <p>Powered by SciBERT & SciSpacy NLP Pipeline</p>
            </div>
          </div>
          <button type="button" className="stitch-modal-close" onClick={onClose} aria-label="Close modal">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="stitch-modal-body">
          {/* Pipeline Connection Banner */}
          <div
            className={`stitch-pipeline-banner ${
              pipelineStatus.connected ? 'is-connected' : 'is-offline'
            }`}
          >
            <span className="material-symbols-outlined">
              {pipelineStatus.connected ? 'check_circle' : 'sensors_off'}
            </span>
            <div className="stitch-pipeline-banner-text">
              <strong>
                {pipelineStatus.connected
                  ? 'AI Pipeline Online'
                  : 'AI Pipeline Service Offline'}
              </strong>
              <span>
                {pipelineStatus.connected
                  ? `SciBERT & SciSpacy running at ${pipelineStatus.url}`
                  : `Start service via: uvicorn app.features.pdf_extraction_engine.app:app --port 8001 (or use Demo Mode below)`}
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="stitch-alert stitch-alert--error" style={{ marginTop: '12px' }}>
              <span className="material-symbols-outlined">error</span>
              <div>{errorMessage}</div>
            </div>
          )}

          {/* Loading / Analyzing State */}
          {isProcessing && (
            <div className="stitch-deploy-state stitch-deploy-state--loading">
              <div className="stitch-spinner stitch-spinner--purple" />
              <h4>Analyzing Academic Document...</h4>
              <p className="stitch-deploy-status-txt">{processingStep}</p>
              <div className="stitch-deploy-files-badge">
                <span>PyMuPDF Segmentation</span>
                <span>•</span>
                <span>SciSpacy NER</span>
                <span>•</span>
                <span>SciBERT Inference</span>
              </div>
            </div>
          )}

          {/* Step 1: Upload PDF screen */}
          {!isProcessing && extractedPapers.length === 0 && (
            <div className="stitch-ai-upload-view">
              <div
                className={`stitch-dropzone ${isDragging ? 'is-dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <span className="material-symbols-outlined stitch-dropzone-icon">upload_file</span>
                <h4>Upload Professor CV or Publications PDF</h4>
                <p>Drag and drop your academic CV, resume, or bibliography PDF here, or click to browse</p>
                {selectedFile && (
                  <div className="stitch-selected-file">
                    <span className="material-symbols-outlined">picture_as_pdf</span>
                    <span className="stitch-selected-file-name">{selectedFile.name}</span>
                    <span className="stitch-selected-file-size">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                )}
              </div>

              <div className="stitch-ai-demo-row">
                <span>Want to test without a PDF?</span>
                <button
                  type="button"
                  className="stitch-link-btn"
                  onClick={handleLoadDemo}
                >
                  Load Sample Academic CV Extractions (SciBERT Demo)
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Extracted Papers Review Screen */}
          {!isProcessing && extractedPapers.length > 0 && (
            <div className="stitch-ai-results-view">
              <div className="stitch-ai-results-header">
                <div>
                  <h4>Extracted Publications ({extractedPapers.length})</h4>
                  <p>Review and select the publications you want to add to your website:</p>
                </div>
                <button type="button" className="stitch-link-btn" onClick={toggleSelectAll}>
                  {selectedIndices.size === extractedPapers.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="stitch-ai-papers-list">
                {extractedPapers.map((paper, idx) => {
                  const isSelected = selectedIndices.has(idx);
                  return (
                    <div
                      key={`extracted-${idx}`}
                      className={`stitch-ai-paper-card ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => toggleSelectPaper(idx)}
                    >
                      <div className="stitch-ai-paper-checkbox">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectPaper(idx)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="stitch-ai-paper-content">
                        <div className="stitch-ai-paper-meta">
                          <span className="stitch-ai-paper-venue">
                            {paper.publisher || (paper.publication_type ? paper.publication_type.toUpperCase() : 'JOURNAL')}
                          </span>
                          {paper.year && <span className="stitch-ai-paper-year">{paper.year}</span>}
                          {formatConfidence(paper.confidence_score)}
                        </div>
                        <h4 className="stitch-ai-paper-title">{paper.title}</h4>
                        <p className="stitch-ai-paper-authors">
                          {Array.isArray(paper.authors) ? paper.authors.join(', ') : 'Author, A.'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="stitch-ai-reupload-row">
                <button
                  type="button"
                  className="stitch-link-btn"
                  onClick={() => {
                    setExtractedPapers([]);
                    setSelectedFile(null);
                  }}
                >
                  ← Upload a different PDF
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="stitch-modal-footer">
          <button type="button" className="stitch-modal-btn stitch-modal-btn--secondary" onClick={onClose}>
            Cancel
          </button>

          <div className="stitch-modal-actions-right">
            {!isProcessing && extractedPapers.length === 0 && (
              <button
                type="button"
                className="stitch-modal-btn stitch-modal-btn--primary stitch-modal-btn--purple"
                onClick={handleRunExtraction}
                disabled={!selectedFile}
              >
                <span className="material-symbols-outlined">auto_awesome</span>
                Extract Publications with AI
              </button>
            )}

            {!isProcessing && extractedPapers.length > 0 && (
              <button
                type="button"
                className="stitch-modal-btn stitch-modal-btn--primary stitch-modal-btn--purple"
                onClick={handleConfirmImport}
                disabled={selectedIndices.size === 0}
              >
                <span className="material-symbols-outlined">library_add</span>
                Import {selectedIndices.size} Publication{selectedIndices.size === 1 ? '' : 's'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

