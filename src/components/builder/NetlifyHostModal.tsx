import React, { useState, useEffect } from 'react';
import {
  deployToNetlify,
  getStoredNetlifyToken,
  saveStoredNetlifyToken,
  getStoredDeployment,
  clearStoredDeployment,
  downloadPortfolioZip,
  checkServerProxyStatus,
  StoredDeployment,
  NetlifyDeployResult,
} from '../../lib/netlifyDeploy';

interface NetlifyHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
  css: string;
  suggestedName?: string;
}

export const NetlifyHostModal: React.FC<NetlifyHostModalProps> = ({
  isOpen,
  onClose,
  html,
  css,
  suggestedName = 'academic-portfolio',
}) => {
  const [token, setToken] = useState<string>('');
  const [rememberToken, setRememberToken] = useState<boolean>(true);
  const [subdomain, setSubdomain] = useState<string>('');
  const [deployMode, setDeployMode] = useState<'update' | 'new'>('new');
  const [currentDeployment, setCurrentDeployment] = useState<StoredDeployment | null>(null);
  const [isServerConfigured, setIsServerConfigured] = useState<boolean>(false);

  const [status, setStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [deployResult, setDeployResult] = useState<NetlifyDeployResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showTokenInput, setShowTokenInput] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const storedToken = getStoredNetlifyToken();
      setToken(storedToken);
      const existing = getStoredDeployment();
      setCurrentDeployment(existing);

      if (existing) {
        setDeployMode('update');
      } else {
        setDeployMode('new');
        const slug = suggestedName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        setSubdomain(slug ? `${slug}-portfolio` : 'academic-portfolio');
      }

      setStatus('idle');
      setErrorMessage('');
      setDeployResult(null);
      setCopied(false);

      // Check server proxy capabilities
      checkServerProxyStatus().then((res) => {
        setIsServerConfigured(res.serverConfigured);
        if (res.serverConfigured) {
          setShowTokenInput(false);
        } else {
          setShowTokenInput(!storedToken);
        }
      });
    }
  }, [isOpen, suggestedName]);

  if (!isOpen) return null;

  const handleDeploy = async () => {
    if (!isServerConfigured && !token.trim()) {
      setShowTokenInput(true);
      setErrorMessage('Please provide a Netlify Personal Access Token to proceed.');
      return;
    }

    if (token.trim() && rememberToken) {
      saveStoredNetlifyToken(token.trim());
    }

    setStatus('deploying');
    setStatusMessage('Bundling portfolio into standard ZIP package...');
    setErrorMessage('');

    try {
      await new Promise((r) => setTimeout(r, 200));
      setStatusMessage('Deploying through secure server proxy to Netlify edge network...');

      const targetSiteId = deployMode === 'update' ? currentDeployment?.siteId : undefined;
      const targetSubdomain = deployMode === 'new' ? subdomain : undefined;

      const result = await deployToNetlify({
        html,
        css,
        token: token.trim() || undefined,
        siteId: targetSiteId,
        customSubdomain: targetSubdomain,
      });

      if (!result.success) {
        setStatus('error');
        setErrorMessage(result.error || 'Deployment failed. Please check server logs or token.');
        return;
      }

      setDeployResult(result);
      setStatus('success');
      setCurrentDeployment(getStoredDeployment());
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'An unexpected error occurred during deployment.');
    }
  };

  const handleCopyLink = () => {
    if (!deployResult?.url) return;
    navigator.clipboard.writeText(deployResult.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="stitch-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="stitch-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="stitch-modal-header">
          <div className="stitch-modal-header-title">
            <span className="material-symbols-outlined stitch-modal-icon">cloud_upload</span>
            <div>
              <h3>Host on Netlify</h3>
              <p>One-click instant static deployment to global CDN</p>
            </div>
          </div>
          <button type="button" className="stitch-modal-close" onClick={onClose} aria-label="Close modal">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="stitch-modal-body">
          {status === 'deploying' && (
            <div className="stitch-deploy-state stitch-deploy-state--loading">
              <div className="stitch-spinner" />
              <h4>Publishing Your Website...</h4>
              <p className="stitch-deploy-status-txt">{statusMessage}</p>
              <div className="stitch-deploy-files-badge">
                <span>index.html</span>
                <span>•</span>
                <span>styles.css</span>
                <span>•</span>
                <span>Fonts & Scripts pre-bundled</span>
              </div>
            </div>
          )}

          {status === 'success' && deployResult && (
            <div className="stitch-deploy-state stitch-deploy-state--success">
              <span className="material-symbols-outlined stitch-success-icon">check_circle</span>
              <h4>Website Live on the Internet!</h4>
              <p>Your academic portfolio is live and reachable worldwide via HTTPS.</p>

              <div className="stitch-live-url-box">
                <input type="text" readOnly value={deployResult.url} className="stitch-live-url-input" />
                <button type="button" className="stitch-modal-btn stitch-modal-btn--secondary" onClick={handleCopyLink}>
                  <span className="material-symbols-outlined">{copied ? 'done' : 'content_copy'}</span>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <a
                  href={deployResult.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stitch-modal-btn stitch-modal-btn--primary"
                >
                  <span className="material-symbols-outlined">open_in_new</span>
                  Open Live Site
                </a>
              </div>

              {deployResult.adminUrl && (
                <div className="stitch-admin-link">
                  <a href={deployResult.adminUrl} target="_blank" rel="noopener noreferrer">
                    Manage DNS & Custom Domains on Netlify <span className="material-symbols-outlined">arrow_outward</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {(status === 'idle' || status === 'error') && (
            <div className="stitch-deploy-form">
              {errorMessage && (
                <div className="stitch-alert stitch-alert--error">
                  <span className="material-symbols-outlined">error</span>
                  <div>{errorMessage}</div>
                </div>
              )}

              {/* Server-Side Proxy Status Badge */}
              {isServerConfigured && (
                <div className="stitch-server-badge">
                  <span className="material-symbols-outlined stitch-server-badge-icon">verified_user</span>
                  <div className="stitch-server-badge-content">
                    <span className="stitch-server-badge-title">Server Proxy Ready (1-Click Hosting)</span>
                    <span className="stitch-server-badge-desc">
                      Netlify deployment credentials are kept private and secure on the backend.
                    </span>
                  </div>
                </div>
              )}

              {/* Existing deployment info */}
              {currentDeployment && (
                <div className="stitch-existing-deploy">
                  <div className="stitch-existing-deploy-info">
                    <span className="material-symbols-outlined">domain</span>
                    <div>
                      <div className="stitch-existing-deploy-label">Currently Deployed Site</div>
                      <a href={currentDeployment.url} target="_blank" rel="noopener noreferrer" className="stitch-existing-deploy-url">
                        {currentDeployment.url}
                        <span className="material-symbols-outlined">open_in_new</span>
                      </a>
                    </div>
                  </div>

                  <div className="stitch-mode-selector">
                    <label className="stitch-radio-label">
                      <input
                        type="radio"
                        name="deployMode"
                        checked={deployMode === 'update'}
                        onChange={() => setDeployMode('update')}
                      />
                      <span>Update this existing site (preserves current URL)</span>
                    </label>
                    <label className="stitch-radio-label">
                      <input
                        type="radio"
                        name="deployMode"
                        checked={deployMode === 'new'}
                        onChange={() => setDeployMode('new')}
                      />
                      <span>Deploy to a new site URL</span>
                    </label>
                  </div>
                </div>
              )}

              {deployMode === 'new' && (
                <div className="stitch-form-group">
                  <label htmlFor="netlify-subdomain" className="stitch-form-label">
                    Site Subdomain (optional)
                  </label>
                  <div className="stitch-subdomain-wrapper">
                    <input
                      id="netlify-subdomain"
                      type="text"
                      placeholder="e.g. jane-doe-portfolio"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      className="stitch-form-input"
                    />
                    <span className="stitch-subdomain-suffix">.netlify.app</span>
                  </div>
                  <span className="stitch-form-hint">Leave blank for an auto-generated unique name.</span>
                </div>
              )}

              {/* Token Section: only needed if server proxy is not configured or user wants to override */}
              {!isServerConfigured || showTokenInput ? (
                <div className="stitch-token-section">
                  <div className="stitch-token-header">
                    <span className="stitch-form-label">Custom Netlify Token (Optional)</span>
                    {isServerConfigured && (
                      <button
                        type="button"
                        className="stitch-link-btn"
                        onClick={() => setShowTokenInput(false)}
                      >
                        Hide
                      </button>
                    )}
                  </div>

                  <input
                    type="password"
                    placeholder="nfp_..."
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="stitch-form-input"
                  />
                  <div className="stitch-token-helper">
                    <span>Override with your personal Netlify token:</span>
                    <a
                      href="https://app.netlify.com/user/applications#personal-access-tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="stitch-inline-link"
                    >
                      Generate token <span className="material-symbols-outlined">arrow_outward</span>
                    </a>
                  </div>
                  <label className="stitch-checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberToken}
                      onChange={(e) => setRememberToken(e.target.checked)}
                    />
                    <span>Remember custom token in this browser</span>
                  </label>
                </div>
              ) : (
                <div className="stitch-token-override-link">
                  <button
                    type="button"
                    className="stitch-link-btn"
                    onClick={() => setShowTokenInput(true)}
                  >
                    Need to deploy to your own personal Netlify account instead? Click here
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="stitch-modal-footer">
          <button
            type="button"
            className="stitch-modal-btn stitch-modal-btn--ghost"
            onClick={() => downloadPortfolioZip(html, css, `${suggestedName}-site.zip`)}
            title="Download complete static HTML/CSS files as ZIP"
          >
            <span className="material-symbols-outlined">download</span>
            Download ZIP
          </button>

          <div className="stitch-modal-actions-right">
            <button type="button" className="stitch-modal-btn stitch-modal-btn--secondary" onClick={onClose}>
              {status === 'success' ? 'Close' : 'Cancel'}
            </button>

            {status !== 'success' && (
              <button
                type="button"
                className="stitch-modal-btn stitch-modal-btn--primary"
                onClick={handleDeploy}
                disabled={status === 'deploying'}
              >
                <span className="material-symbols-outlined">
                  {status === 'deploying' ? 'sync' : 'rocket_launch'}
                </span>
                {status === 'deploying'
                  ? 'Deploying...'
                  : deployMode === 'update'
                  ? 'Update Live Site'
                  : 'Host on Netlify'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
