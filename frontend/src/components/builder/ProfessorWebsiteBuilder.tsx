import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import './ProfessorWebsiteBuilder.css';

type PublicationItem = {
  meta: string;
  title: string;
  citation: string;
  links: string[];
};

type TemplateData = {
  brand: string;
  topNav: string[];
  cvButton: string;
  sideTitle: string;
  sideSubtitle: string;
  sideNav: string[];
  profileName: string;
  profileTitle: string;
  officeLabel: string;
  officeLine1: string;
  officeLine2: string;
  emailLabel: string;
  email: string;
  phoneLabel: string;
  phone: string;
  webLabel: string;
  web: string;
  chips: string[];
  biographyTitle: string;
  biographyP1: string;
  biographyP2: string;
  honorsTitle: string;
  honorsEyebrow: string;
  honorsLeadStart: string;
  honorsLeadEmphasis: string;
  honorsLeadEnd: string;
  honorsReadMore: string;
  honorsItems: Array<{ year: string; title: string }>;
  publicationsTitle: string;
  publications: PublicationItem[];
  loadMoreLabel: string;
  footerBrand: string;
  footerTagline: string;
  resourcesTitle: string;
  resourceLinks: string[];
  contactTitle: string;
  contactLine1: string;
  contactLine2: string;
  copyright: string;
  portraitSrc: string;
};

const INITIAL_DATA: TemplateData = {
  brand: 'Professor Jane Doe',
  topNav: ['Contact', 'Department', 'Research Lab'],
  cvButton: 'Download CV',
  sideTitle: 'Navigation',
  sideSubtitle: 'Academic Portfolio',
  sideNav: ['Biography', 'Honors', 'Publications', 'Articles & Press'],
  profileName: 'Jane Doe',
  profileTitle: 'Professor of Applied Economics & Public Policy',
  officeLabel: 'Office',
  officeLine1: 'Building E52, Room 412',
  officeLine2: '50 Memorial Drive, Cambridge, MA',
  emailLabel: 'Email',
  email: 'jdoe@institution.edu',
  phoneLabel: 'Phone',
  phone: '+1 (617) 555-0192',
  webLabel: 'Digital Presence',
  web: 'janedoe.academic.org',
  chips: ['Affiliated Groups', 'Dept. of Economics', 'Center for Global Policy', 'Institute for Data Systems'],
  biographyTitle: 'Biography',
  biographyP1:
    'Jane Doe is a distinguished Professor of Applied Economics, specializing in the intersection of behavioral psychology and global market dynamics. Her pioneering research over the last two decades has redefined institutional frameworks for emerging economies, specifically focusing on the scalability of micro-finance initiatives in sub-Saharan Africa.',
  biographyP2:
    'Before joining the faculty, she served as a Chief Economic Advisor to the International Monetary Fund and held senior fellowships at several leading think tanks. Her methodology combines rigorous quantitative data with qualitative field observations, a practice that has become a benchmark in modern economic ethnographic studies.',
  honorsTitle: 'Honors',
  honorsEyebrow: 'Latest Achievement',
  honorsLeadStart: 'Awarded Nobel Prize in Economic Sciences for her contribution to',
  honorsLeadEmphasis: 'Behavioral Market Stability',
  honorsLeadEnd: '.',
  honorsReadMore: 'Read More',
  honorsItems: [
    { year: '2022', title: 'Distinguished Fellow of the American Economic Association' },
    { year: '2019', title: 'John Bates Clark Medal for Contributions to Economic Thought' },
  ],
  publicationsTitle: 'Publications',
  publications: [
    {
      meta: 'Journal of Monetary Systems • 2023',
      title: 'The Volatility of Perception: How Social Sentiment Predicts Market Floor Collapse',
      citation: 'Doe, J., Smith, R., & Tan, L. (2023). Volume 42, Issue 4, pp. 210-245.',
      links: ['PDF Abstract', 'View Publisher Site'],
    },
    {
      meta: 'Oxford Academic Press • 2021',
      title: 'Structural Anchors: Rebuilding Post-Crisis Fiscal Policies in Emerging Markets',
      citation: 'Doe, J. (2021). Monograph Series on Global Governance, 14th Ed.',
      links: ['Full Text Access'],
    },
    {
      meta: 'The Quarterly Review of Economics • 2020',
      title: 'Micro-Loans and Macro-Growth: A Longitudinal Study on Urban Credit Unions',
      citation: 'Chen, Y. & Doe, J. (2020). Vol 88, pp. 45-67.',
      links: ['Data Sets', 'Abstract'],
    },
  ],
  loadMoreLabel: 'Load More Publications',
  footerBrand: 'Professor Jane Doe',
  footerTagline:
    'Devoted to the pursuit of knowledge and the rigorous examination of our global financial ecosystems.',
  resourcesTitle: 'Resources',
  resourceLinks: ['Institutional Privacy', 'Accessibility', 'Directory'],
  contactTitle: 'Contact',
  contactLine1: 'Cambridge, Massachusetts',
  contactLine2: 'United States of America',
  copyright: '© 2024 Jane Doe. All rights reserved.',
  portraitSrc:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC3aqxJRPOMSYncJZsYAgHT_FVEPmu7fBQ591YNgpM5jnv1B9h9JvvZgTacVjHoNTUMRPlw5V9B1J6EEsevcSszpT9PSq0lyhtXCvli2AkQjRv5Bi1PX6ZB0uJAOApgoj_4ArRjTu3jmcGapESTk9xix0sd2EQy8xnv_7Y8UthzCrfcy60_bvTorojSqZ-mwZ4p-hKdGvo6JxXwGp9oEU6p59u5azusz2MUA4s5i38A0KxaFREhg2MgmRahTM8dVgnOic7MD1bi1bY',
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildTemplateHtml(data: TemplateData): string {
  const topNav = data.topNav
    .map((item) => `            <a href="#">${escapeHtml(item)}</a>`)
    .join('\n');

  const sideNav = data.sideNav
    .map((item, index) => `            <a href="#${index === 0 ? 'biography' : index === 1 ? 'honors' : index === 2 ? 'publications' : 'press'}">${escapeHtml(item)}</a>`)
    .join('\n');

  const chips = data.chips.map((chip) => `            <span>${escapeHtml(chip)}</span>`).join('\n');

  const honors = data.honorsItems
    .map(
      (item) => `                  <div>
                    <p>${escapeHtml(item.year)}</p>
                    <p>${escapeHtml(item.title)}</p>
                  </div>`
    )
    .join('\n');

  const publications = data.publications
    .map((item, index) => {
      const links = item.links.map((link) => `                        <a href="#">${escapeHtml(link)}</a>`).join('\n');
      const idAttr = index === 2 ? ' id="press"' : '';
      return `                  <li${idAttr}>
                    <div class="stitch-pub-head">
                      <span class="material-symbols-outlined">menu_book</span>
                      <div>
                        <p>${escapeHtml(item.meta)}</p>
                        <h4>${escapeHtml(item.title)}</h4>
                      </div>
                    </div>
                    <div class="stitch-pub-body">
                      <p>${escapeHtml(item.citation)}</p>
                      <div>
${links}
                      </div>
                    </div>
                  </li>`;
    })
    .join('\n');

  const resourceLinks = data.resourceLinks
    .map((item) => `                <a href="#">${escapeHtml(item)}</a>`)
    .join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(data.brand)}</title>
    <link rel="stylesheet" href="ProfessorWebsiteBuilder.css" />
  </head>
  <body>
    <div class="stitch-page">
      <header class="stitch-topbar">
        <div class="stitch-topbar-inner">
          <div class="stitch-brand">${escapeHtml(data.brand)}</div>
          <nav class="stitch-topnav">
${topNav}
            <button type="button">${escapeHtml(data.cvButton)}</button>
          </nav>
        </div>
        <div class="stitch-divider"></div>
      </header>

      <div class="stitch-layout">
        <aside class="stitch-sidebar">
          <div class="stitch-sidebar-head">
            <p>${escapeHtml(data.sideTitle)}</p>
            <p>${escapeHtml(data.sideSubtitle)}</p>
          </div>
          <nav class="stitch-sidenav">
${sideNav}
          </nav>
        </aside>

        <main class="stitch-main">
          <section class="stitch-hero">
            <div class="stitch-hero-media">
              <div class="stitch-portrait-frame">
                <img alt="${escapeHtml(data.profileName)}" src="${escapeHtml(data.portraitSrc)}" />
              </div>
            </div>
            <div class="stitch-hero-copy">
              <div>
                <h1>${escapeHtml(data.profileName)}</h1>
                <p>${escapeHtml(data.profileTitle)}</p>
              </div>
              <div class="stitch-contact-grid">
                <div>
                  <div class="stitch-contact-row">
                    <span class="material-symbols-outlined">location_on</span>
                    <div>
                      <p>${escapeHtml(data.officeLabel)}</p>
                      <p>${escapeHtml(data.officeLine1)}</p>
                      <p>${escapeHtml(data.officeLine2)}</p>
                    </div>
                  </div>
                  <div class="stitch-contact-row">
                    <span class="material-symbols-outlined">mail</span>
                    <div>
                      <p>${escapeHtml(data.emailLabel)}</p>
                      <p>${escapeHtml(data.email)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="stitch-contact-row">
                    <span class="material-symbols-outlined">call</span>
                    <div>
                      <p>${escapeHtml(data.phoneLabel)}</p>
                      <p>${escapeHtml(data.phone)}</p>
                    </div>
                  </div>
                  <div class="stitch-contact-row">
                    <span class="material-symbols-outlined">language</span>
                    <div>
                      <p>${escapeHtml(data.webLabel)}</p>
                      <p>${escapeHtml(data.web)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="stitch-biography" id="biography">
            <div class="stitch-chip-row">
${chips}
            </div>
            <div class="stitch-split">
              <div><h2>${escapeHtml(data.biographyTitle)}</h2></div>
              <div>
                <p>${escapeHtml(data.biographyP1)}</p>
                <p>${escapeHtml(data.biographyP2)}</p>
              </div>
            </div>
          </section>

          <section class="stitch-honors" id="honors">
            <div class="stitch-split">
              <div><h2>${escapeHtml(data.honorsTitle)}</h2></div>
              <div>
                <span class="stitch-eyebrow">${escapeHtml(data.honorsEyebrow)}</span>
                <h3>${escapeHtml(data.honorsLeadStart)} <span>${escapeHtml(data.honorsLeadEmphasis)}</span>${escapeHtml(data.honorsLeadEnd)}</h3>
                <button type="button" class="stitch-inline-btn">${escapeHtml(data.honorsReadMore)}</button>
                <div class="stitch-honors-grid">
${honors}
                </div>
              </div>
            </div>
          </section>

          <section class="stitch-publications" id="publications">
            <div class="stitch-split">
              <div><h2>${escapeHtml(data.publicationsTitle)}</h2></div>
              <div>
                <ul>
${publications}
                </ul>
                <div class="stitch-loadmore">
                  <button type="button">${escapeHtml(data.loadMoreLabel)}</button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <footer class="stitch-footer">
        <div class="stitch-footer-inner">
          <div>
            <div>${escapeHtml(data.footerBrand)}</div>
            <p>${escapeHtml(data.footerTagline)}</p>
          </div>
          <div class="stitch-footer-links">
            <div>
              <p>${escapeHtml(data.resourcesTitle)}</p>
              <nav>
${resourceLinks}
              </nav>
            </div>
            <div>
              <p>${escapeHtml(data.contactTitle)}</p>
              <p>${escapeHtml(data.contactLine1)}<br />${escapeHtml(data.contactLine2)}</p>
            </div>
          </div>
        </div>
        <div class="stitch-copyright">${escapeHtml(data.copyright)}</div>
      </footer>
    </div>
  </body>
</html>`;
}

function EditableText({
  value,
  onChange,
  editable,
  className,
  as = 'span',
}: {
  value: string;
  onChange: (next: string) => void;
  editable: boolean;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'a' | 'button' | 'div';
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.activeElement === el) return;
    if ((el.textContent || '') !== value) {
      el.textContent = value;
    }
  }, [value]);

  return React.createElement(as, {
    ref,
    className: `${className || ''} stitch-editable ${editable ? 'is-editable' : 'is-readonly'}`.trim(),
    contentEditable: editable,
    suppressContentEditableWarning: true,
    onInput: (event: React.FormEvent<HTMLElement>) => {
      if (!editable) return;
      onChange(event.currentTarget.textContent || '');
    },
    dir: 'ltr',
    spellCheck: editable,
  });
}

export function ProfessorWebsiteBuilder() {
  const [data, setData] = useState<TemplateData>(INITIAL_DATA);
  const [leftNavCollapsed, setLeftNavCollapsed] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('biography');
  const windowBodyRef = useRef<HTMLDivElement | null>(null);

  const templateCode = useMemo(() => buildTemplateHtml(data), [data]);

  useEffect(() => {
    const root = windowBodyRef.current;
    if (!root) return;

    const sectionIds = ['biography', 'honors', 'publications', 'press'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visible.length) return;
        const id = visible[0].target.id;
        if (id) setActiveSectionId(id);
      },
      {
        root,
        threshold: [0.2, 0.4, 0.6, 0.8],
        rootMargin: '-15% 0px -45% 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const navTargetIdByIndex = (index: number): string => {
    if (index === 0) return 'biography';
    if (index === 1) return 'honors';
    if (index === 2) return 'publications';
    return 'press';
  };

  const onSideNavClick = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    const target = document.getElementById(sectionId);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSectionId(sectionId);
  };

  const onUploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) return;
      setData((prev) => ({ ...prev, portraitSrc: result }));
    };
    reader.readAsDataURL(file);
    event.currentTarget.value = '';
  };

  return (
    <div className="stitch-workspace">
      <div className="stitch-window" role="region" aria-label="Editable website window">
        <div className="stitch-window-bar">
          <div className="stitch-window-dots">
            <span />
            <span />
            <span />
          </div>
          <div className="stitch-window-title">Editable Template Window</div>
          <div className="stitch-window-actions">
            <button
              type="button"
              className={`stitch-collapse-btn ${isEditMode ? 'is-active' : ''}`}
              onClick={() => setIsEditMode((prev) => !prev)}
            >
              {isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
            </button>
            <button
              type="button"
              className="stitch-collapse-btn"
              onClick={() => setLeftNavCollapsed((prev) => !prev)}
            >
              {leftNavCollapsed ? 'Show Left Nav' : 'Hide Left Nav'}
            </button>
            <label className={`stitch-upload-btn ${isEditMode ? '' : 'is-disabled'}`}>
              Upload Image
              <input type="file" accept="image/*" onChange={onUploadImage} disabled={!isEditMode} />
            </label>
          </div>
        </div>

        <div className="stitch-window-body" ref={windowBodyRef}>
          <div className="stitch-page">
            <header className="stitch-topbar">
              <div className="stitch-topbar-inner">
                <EditableText editable={isEditMode} value={data.brand} onChange={(next) => setData((prev) => ({ ...prev, brand: next }))} className="stitch-brand" as="div" />
                <nav className="stitch-topnav">
                  {data.topNav.map((item, index) => (
                    <a key={`top-${index}`} href="#">
                      <EditableText
                        editable={isEditMode}
                        value={item}
                        onChange={(next) =>
                          setData((prev) => ({
                            ...prev,
                            topNav: prev.topNav.map((entry, idx) => (idx === index ? next : entry)),
                          }))
                        }
                      />
                    </a>
                  ))}
                  <EditableText editable={isEditMode} value={data.cvButton} onChange={(next) => setData((prev) => ({ ...prev, cvButton: next }))} as="button" />
                </nav>
              </div>
              <div className="stitch-divider" />
            </header>

            <div className={`stitch-layout ${leftNavCollapsed ? 'left-nav-collapsed' : ''}`}>
              <aside className="stitch-sidebar">
                <div className="stitch-sidebar-head">
                  <EditableText editable={isEditMode} value={data.sideTitle} onChange={(next) => setData((prev) => ({ ...prev, sideTitle: next }))} as="p" />
                  <EditableText editable={isEditMode} value={data.sideSubtitle} onChange={(next) => setData((prev) => ({ ...prev, sideSubtitle: next }))} as="p" />
                </div>
                <nav className="stitch-sidenav">
                  {data.sideNav.map((item, index) => (
                    <a
                      key={`side-${index}`}
                      className={activeSectionId === navTargetIdByIndex(index) ? 'active' : undefined}
                      href={`#${navTargetIdByIndex(index)}`}
                      onClick={(event) => onSideNavClick(event, navTargetIdByIndex(index))}
                    >
                      <span className="material-symbols-outlined">
                        {index === 0 ? 'person' : index === 1 ? 'military_tech' : index === 2 ? 'menu_book' : 'newspaper'}
                      </span>
                      <EditableText
                        editable={isEditMode}
                        value={item}
                        onChange={(next) =>
                          setData((prev) => ({
                            ...prev,
                            sideNav: prev.sideNav.map((entry, idx) => (idx === index ? next : entry)),
                          }))
                        }
                      />
                    </a>
                  ))}
                </nav>
              </aside>

              <main className="stitch-main">
                <section className="stitch-hero">
                  <div className="stitch-hero-media">
                    <div className="stitch-portrait-frame">
                      <img alt={data.profileName} src={data.portraitSrc} />
                    </div>
                  </div>
                  <div className="stitch-hero-copy">
                    <div>
                      <EditableText editable={isEditMode} value={data.profileName} onChange={(next) => setData((prev) => ({ ...prev, profileName: next }))} as="h1" />
                      <EditableText editable={isEditMode} value={data.profileTitle} onChange={(next) => setData((prev) => ({ ...prev, profileTitle: next }))} as="p" />
                    </div>
                    <div className="stitch-contact-grid">
                      <div>
                        <div className="stitch-contact-row">
                          <span className="material-symbols-outlined">location_on</span>
                          <div>
                            <EditableText editable={isEditMode} value={data.officeLabel} onChange={(next) => setData((prev) => ({ ...prev, officeLabel: next }))} as="p" />
                            <EditableText editable={isEditMode} value={data.officeLine1} onChange={(next) => setData((prev) => ({ ...prev, officeLine1: next }))} as="p" />
                            <EditableText editable={isEditMode} value={data.officeLine2} onChange={(next) => setData((prev) => ({ ...prev, officeLine2: next }))} as="p" />
                          </div>
                        </div>
                        <div className="stitch-contact-row">
                          <span className="material-symbols-outlined">mail</span>
                          <div>
                            <EditableText editable={isEditMode} value={data.emailLabel} onChange={(next) => setData((prev) => ({ ...prev, emailLabel: next }))} as="p" />
                            <EditableText editable={isEditMode} value={data.email} onChange={(next) => setData((prev) => ({ ...prev, email: next }))} as="p" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="stitch-contact-row">
                          <span className="material-symbols-outlined">call</span>
                          <div>
                            <EditableText editable={isEditMode} value={data.phoneLabel} onChange={(next) => setData((prev) => ({ ...prev, phoneLabel: next }))} as="p" />
                            <EditableText editable={isEditMode} value={data.phone} onChange={(next) => setData((prev) => ({ ...prev, phone: next }))} as="p" />
                          </div>
                        </div>
                        <div className="stitch-contact-row">
                          <span className="material-symbols-outlined">language</span>
                          <div>
                            <EditableText editable={isEditMode} value={data.webLabel} onChange={(next) => setData((prev) => ({ ...prev, webLabel: next }))} as="p" />
                            <EditableText editable={isEditMode} value={data.web} onChange={(next) => setData((prev) => ({ ...prev, web: next }))} as="p" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="stitch-biography" id="biography">
                  <div className="stitch-chip-row">
                    {data.chips.map((chip, index) => (
                      <EditableText
                        editable={isEditMode}
                        key={`chip-${index}`}
                        value={chip}
                        onChange={(next) =>
                          setData((prev) => ({
                            ...prev,
                            chips: prev.chips.map((entry, idx) => (idx === index ? next : entry)),
                          }))
                        }
                      />
                    ))}
                  </div>
                  <div className="stitch-split">
                    <div>
                      <EditableText editable={isEditMode} value={data.biographyTitle} onChange={(next) => setData((prev) => ({ ...prev, biographyTitle: next }))} as="h2" />
                    </div>
                    <div>
                      <EditableText editable={isEditMode} value={data.biographyP1} onChange={(next) => setData((prev) => ({ ...prev, biographyP1: next }))} as="p" />
                      <EditableText editable={isEditMode} value={data.biographyP2} onChange={(next) => setData((prev) => ({ ...prev, biographyP2: next }))} as="p" />
                    </div>
                  </div>
                </section>

                <section className="stitch-honors" id="honors">
                  <div className="stitch-split">
                    <div>
                      <EditableText editable={isEditMode} value={data.honorsTitle} onChange={(next) => setData((prev) => ({ ...prev, honorsTitle: next }))} as="h2" />
                    </div>
                    <div>
                      <EditableText editable={isEditMode} value={data.honorsEyebrow} onChange={(next) => setData((prev) => ({ ...prev, honorsEyebrow: next }))} as="span" className="stitch-eyebrow" />
                      <h3>
                        <EditableText editable={isEditMode} value={data.honorsLeadStart} onChange={(next) => setData((prev) => ({ ...prev, honorsLeadStart: next }))} />{' '}
                        <EditableText editable={isEditMode} value={data.honorsLeadEmphasis} onChange={(next) => setData((prev) => ({ ...prev, honorsLeadEmphasis: next }))} as="span" />
                        <EditableText editable={isEditMode} value={data.honorsLeadEnd} onChange={(next) => setData((prev) => ({ ...prev, honorsLeadEnd: next }))} />
                      </h3>
                      <button type="button" className="stitch-inline-btn">
                        <EditableText editable={isEditMode} value={data.honorsReadMore} onChange={(next) => setData((prev) => ({ ...prev, honorsReadMore: next }))} />{' '}
                        <span className="material-symbols-outlined">arrow_right_alt</span>
                      </button>
                      <div className="stitch-honors-grid">
                        {data.honorsItems.map((item, index) => (
                          <div key={`honor-${index}`}>
                            <EditableText
                              value={item.year}
                              editable={isEditMode}
                              onChange={(next) =>
                                setData((prev) => ({
                                  ...prev,
                                  honorsItems: prev.honorsItems.map((entry, idx) =>
                                    idx === index ? { ...entry, year: next } : entry
                                  ),
                                }))
                              }
                              as="p"
                            />
                            <EditableText
                              value={item.title}
                              editable={isEditMode}
                              onChange={(next) =>
                                setData((prev) => ({
                                  ...prev,
                                  honorsItems: prev.honorsItems.map((entry, idx) =>
                                    idx === index ? { ...entry, title: next } : entry
                                  ),
                                }))
                              }
                              as="p"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="stitch-publications" id="publications">
                  <div className="stitch-split">
                    <div>
                      <EditableText editable={isEditMode} value={data.publicationsTitle} onChange={(next) => setData((prev) => ({ ...prev, publicationsTitle: next }))} as="h2" />
                    </div>
                    <div>
                      <ul>
                        {data.publications.map((item, index) => (
                          <li key={`pub-${index}`} id={index === 2 ? 'press' : undefined}>
                            <div className="stitch-pub-head">
                              <span className="material-symbols-outlined">menu_book</span>
                              <div>
                                <EditableText
                                  value={item.meta}
                                  editable={isEditMode}
                                  onChange={(next) =>
                                    setData((prev) => ({
                                      ...prev,
                                      publications: prev.publications.map((entry, idx) =>
                                        idx === index ? { ...entry, meta: next } : entry
                                      ),
                                    }))
                                  }
                                  as="p"
                                />
                                <EditableText
                                  value={item.title}
                                  editable={isEditMode}
                                  onChange={(next) =>
                                    setData((prev) => ({
                                      ...prev,
                                      publications: prev.publications.map((entry, idx) =>
                                        idx === index ? { ...entry, title: next } : entry
                                      ),
                                    }))
                                  }
                                  as="h4"
                                />
                              </div>
                            </div>
                            <div className="stitch-pub-body">
                              <EditableText
                                value={item.citation}
                                editable={isEditMode}
                                onChange={(next) =>
                                  setData((prev) => ({
                                    ...prev,
                                    publications: prev.publications.map((entry, idx) =>
                                      idx === index ? { ...entry, citation: next } : entry
                                    ),
                                  }))
                                }
                                as="p"
                              />
                              <div>
                                {item.links.map((link, linkIndex) => (
                                  <a key={`link-${index}-${linkIndex}`} href="#">
                                    <EditableText
                                      value={link}
                                      editable={isEditMode}
                                      onChange={(next) =>
                                        setData((prev) => ({
                                          ...prev,
                                          publications: prev.publications.map((entry, idx) =>
                                            idx === index
                                              ? {
                                                  ...entry,
                                                  links: entry.links.map((entryLink, entryLinkIndex) =>
                                                    entryLinkIndex === linkIndex ? next : entryLink
                                                  ),
                                                }
                                              : entry
                                          ),
                                        }))
                                      }
                                    />
                                  </a>
                                ))}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="stitch-loadmore">
                        <button type="button">
                          <EditableText
                            editable={isEditMode}
                            value={data.loadMoreLabel}
                            onChange={(next) => setData((prev) => ({ ...prev, loadMoreLabel: next }))}
                          />
                          <span className="material-symbols-outlined">expand_more</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </main>
            </div>

            <footer className="stitch-footer">
              <div className="stitch-footer-inner">
                <div>
                  <EditableText editable={isEditMode} value={data.footerBrand} onChange={(next) => setData((prev) => ({ ...prev, footerBrand: next }))} as="div" />
                  <EditableText editable={isEditMode} value={data.footerTagline} onChange={(next) => setData((prev) => ({ ...prev, footerTagline: next }))} as="p" />
                </div>
                <div className="stitch-footer-links">
                  <div>
                    <EditableText editable={isEditMode} value={data.resourcesTitle} onChange={(next) => setData((prev) => ({ ...prev, resourcesTitle: next }))} as="p" />
                    <nav>
                      {data.resourceLinks.map((item, index) => (
                        <a key={`resource-${index}`} href="#">
                          <EditableText
                            editable={isEditMode}
                            value={item}
                            onChange={(next) =>
                              setData((prev) => ({
                                ...prev,
                                resourceLinks: prev.resourceLinks.map((entry, idx) => (idx === index ? next : entry)),
                              }))
                            }
                          />
                        </a>
                      ))}
                    </nav>
                  </div>
                  <div>
                    <EditableText editable={isEditMode} value={data.contactTitle} onChange={(next) => setData((prev) => ({ ...prev, contactTitle: next }))} as="p" />
                    <p>
                      <EditableText editable={isEditMode} value={data.contactLine1} onChange={(next) => setData((prev) => ({ ...prev, contactLine1: next }))} />
                      <br />
                      <EditableText editable={isEditMode} value={data.contactLine2} onChange={(next) => setData((prev) => ({ ...prev, contactLine2: next }))} />
                    </p>
                  </div>
                </div>
              </div>
              <EditableText editable={isEditMode} value={data.copyright} onChange={(next) => setData((prev) => ({ ...prev, copyright: next }))} className="stitch-copyright" as="div" />
            </footer>
          </div>
        </div>
      </div>

      <section className="stitch-code-panel" aria-label="Template code output">
        <h3>Template HTML (auto-updated)</h3>
        <textarea value={templateCode} readOnly />
      </section>
    </div>
  );
}
