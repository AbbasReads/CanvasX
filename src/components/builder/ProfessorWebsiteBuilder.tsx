import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import './ProfessorWebsiteBuilder.css';
import rawProfessorWebsiteBuilderCss from './ProfessorWebsiteBuilder.css?raw';


type LinkItem = {
  label: string;
  href: string;
};

type CustomSection = {
  id: string;
  title: string;
  content: string;
};

type PublicationItem = {
  journal: string;
  year: string;
  title: string;
  authors: string;
  links: LinkItem[];
};

type StudentStats = {
  phdTotal: string;
  phdCurrent: string;
  phdAlumni: string;
  mastersTotal: string;
  postdocCurrent: string;
};

type StudentItem = {
  name: string;
  year: string;
  placement: string;
  url?: string;
};

type StudentCategory = {
  id: string;
  label: string;
  students: StudentItem[];
};

type SectionVisibility = {
  topbar: boolean;
  sidebar: boolean;
  hero: boolean;
  biography: boolean;
  honors: boolean;
  publications: boolean;
  students: boolean;
  loadMore: boolean;
  footer: boolean;
};

type TemplateData = {
  brand: string;
  topNav: LinkItem[];
  cvHref: string;
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
  studentsTitle: string;
  studentStats: StudentStats;
  studentCategories: StudentCategory[];
  footerBrand: string;
  footerTagline: string;
  resourcesTitle: string;
  resourceLinks: LinkItem[];
  contactTitle: string;
  contactLine1: string;
  contactLine2: string;
  copyright: string;
  portraitSrc: string;
  customSections: CustomSection[];
  visibility: SectionVisibility;
};

const ARTICLE_START_INDEX = 2;
const TEMPLATE_EXPORT_MARKER = '/* Template export styles */';

const INITIAL_DATA: TemplateData = {
  brand: 'Professor Jane Doe',
  customSections: [],
  topNav: [
    { label: 'Contact', href: '#contact' },
    { label: 'Department', href: 'https://www.mit.edu/' },
    { label: 'Research Lab', href: 'https://www.nber.org/' },
  ],
  cvHref: '#',
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
      journal: 'Journal of Monetary Systems',
      year: '2023',
      title: 'The Volatility of Perception: How Social Sentiment Predicts Market Floor Collapse',
      authors: 'Doe, J., Smith, R., & Tan, L.',
      links: [
        { label: 'PDF', href: '#' },
        { label: 'Publisher Site', href: 'https://example.com/publisher' },
      ],
    },
    {
      journal: 'Oxford Academic Press',
      year: '2021',
      title: 'Structural Anchors: Rebuilding Post-Crisis Fiscal Policies in Emerging Markets',
      authors: 'Doe, J.',
      links: [{ label: 'Full Text', href: '#' }],
    },
    {
      journal: 'The Quarterly Review of Economics',
      year: '2020',
      title: 'Micro-Loans and Macro-Growth: A Longitudinal Study on Urban Credit Unions',
      authors: 'Chen, Y. & Doe, J.',
      links: [
        { label: 'Data Sets', href: '#' },
        { label: 'Article', href: '#' },
      ],
    },
    {
      journal: 'American Economic Review',
      year: '2019',
      title: 'Decentralized Clearinghouses: Liquidity Buffers and Network Stability',
      authors: 'Doe, J., Henderson, T., & Zhao, K.',
      links: [
        { label: 'PDF', href: '#' },
        { label: 'NBER Working Paper', href: '#' },
      ],
    },
    {
      journal: 'Harvard University Press',
      year: '2018',
      title: 'Monetary Coordinates: A Century of Central Banking Interventions',
      authors: 'Doe, J.',
      links: [
        { label: 'Book Site', href: '#' },
      ],
    },
  ],
  loadMoreLabel: 'Load More Publications',
  studentsTitle: 'Students & Advising',
  studentStats: {
    phdTotal: '24',
    phdCurrent: '6',
    phdAlumni: '18',
    mastersTotal: '31',
    postdocCurrent: '3',
  },
  studentCategories: [
    {
      id: 'phd-alumni',
      label: 'PhD Alumni',
      students: [
        {
          name: 'Dr. Marcus Vance',
          year: "PhD '23",
          placement: 'Assistant Professor of Finance, Columbia Business School',
          url: 'https://example.com',
        },
        {
          name: 'Dr. Elena Rostova',
          year: "PhD '21",
          placement: 'Senior Quantitative Researcher, Two Sigma Investments',
          url: 'https://example.com',
        },
        {
          name: 'Dr. Kenji Sato',
          year: "PhD '19",
          placement: 'Research Scientist, Google DeepMind',
          url: 'https://example.com',
        },
      ],
    },
    {
      id: 'phd-current',
      label: 'Current PhD Students',
      students: [
        {
          name: 'Amina Al-Mansoor',
          year: '4th Year Candidate',
          placement: 'Climate Risk Pricing in Municipal Debt Markets',
          url: 'https://example.com',
        },
        {
          name: 'Liam Chen',
          year: '2nd Year Student',
          placement: 'Sovereign Debt Restructuring via Automated Protocols',
        },
      ],
    },
    {
      id: 'postdocs',
      label: 'Postdoctoral Scholars',
      students: [
        {
          name: 'Dr. Sophie Laurent',
          year: '2024–present',
          placement: 'Household Liquidity Buffers (Ph.D. London School of Economics)',
        },
      ],
    },
    {
      id: 'masters',
      label: 'Masters & Researchers',
      students: [
        {
          name: 'David Thorne',
          year: "MS '24",
          placement: 'Quantitative Strategist, BlackRock',
        },
      ],
    },
  ],
  footerBrand: 'Professor Jane Doe',
  footerTagline:
    'Devoted to the pursuit of knowledge and the rigorous examination of our global financial ecosystems.',
  resourcesTitle: 'Resources',
  resourceLinks: [
    { label: 'Institutional Privacy', href: '#' },
    { label: 'Accessibility', href: '#' },
    { label: 'Directory', href: '#' },
  ],
  contactTitle: 'Contact',
  contactLine1: 'Cambridge, Massachusetts',
  contactLine2: 'United States of America',
  copyright: '© 2024 Jane Doe. All rights reserved.',
  portraitSrc:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC3aqxJRPOMSYncJZsYAgHT_FVEPmu7fBQ591YNgpM5jnv1B9h9JvvZgTacVjHoNTUMRPlw5V9B1J6EEsevcSszpT9PSq0lyhtXCvli2AkQjRv5Bi1PX6ZB0uJAOApgoj_4ArRjTu3jmcGapESTk9xix0sd2EQy8xnv_7Y8UthzCrfcy60_bvTorojSqZ-mwZ4p-hKdGvo6JxXwGp9oEU6p59u5azusz2MUA4s5i38A0KxaFREhg2MgmRahTM8dVgnOic7MD1bi1bY',
  visibility: {
    topbar: true,
    sidebar: true,
    hero: true,
    biography: true,
    honors: true,
    publications: true,
    students: true,
    loadMore: true,
    footer: true,
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '#';
  if (trimmed.startsWith('#') || trimmed.startsWith('/') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed, window.location.origin);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    return '#';
  }

  return '#';
}

function sanitizeRichText(value: string): string {
  if (!value) return '';

  const template = document.createElement('template');
  template.innerHTML = value;

  const sanitizeNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return escapeHtml(node.textContent || '');
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const element = node as HTMLElement;
    const tag = element.tagName.toLowerCase();
    const children = Array.from(element.childNodes).map(sanitizeNode).join('');

    if (tag === 'br') return '<br />';
    if (tag === 'strong' || tag === 'b') return `<strong>${children}</strong>`;
    if (tag === 'em' || tag === 'i') return `<em>${children}</em>`;
    if (tag === 'u') return `<u>${children}</u>`;
    if (tag === 'a') {
      return `<a href="${escapeHtml(sanitizeUrl(element.getAttribute('href') || '#'))}">${children}</a>`;
    }
    if (tag === 'div' || tag === 'p') {
      return children ? `${children}<br />` : '';
    }

    return children;
  };

  return Array.from(template.content.childNodes)
    .map(sanitizeNode)
    .join('')
    .replace(/(<br \/>)+$/g, '');
}

function getLinkHref(href: string): string {
  return sanitizeUrl(href);
}

function renderRichText(value: string): string {
  return sanitizeRichText(value);
}

function buildTemplateHtml(data: TemplateData): string {
  const pageClassName = getPageClassName(data.visibility);
  const layoutClassName = getLayoutClassName(!data.visibility.sidebar);
  const sideNavItems = [
    { id: 'biography', label: data.sideNav[0], icon: 'person', visible: data.visibility.sidebar && data.visibility.biography },
    { id: 'honors', label: data.sideNav[1], icon: 'military_tech', visible: data.visibility.sidebar && data.visibility.honors },
    { id: 'publications', label: data.sideNav[2], icon: 'menu_book', visible: data.visibility.sidebar && data.visibility.publications },
    {
      id: 'press',
      label: data.sideNav[3],
      icon: 'newspaper',
      visible: data.visibility.sidebar && data.visibility.publications && data.publications.length > ARTICLE_START_INDEX,
    },
    { id: 'students', label: 'Students & Advising', icon: 'school', visible: data.visibility.sidebar && data.visibility.students },
  ].filter((item) => item.visible);

  const topNav = data.topNav
    .map((item) => `            <a href="${escapeHtml(getLinkHref(item.href))}">${renderRichText(item.label)}</a>`)
    .join('\n');

  const sideNav = sideNavItems
    .map((item, index) => `            <a href="#${item.id}"${index === 0 ? ' class="active"' : ''}><span class="material-symbols-outlined">${item.icon}</span><span>${renderRichText(item.label)}</span></a>`)
    .join('\n');

  const chips = data.chips.map((chip) => `            <span>${renderRichText(chip)}</span>`).join('\n');

  const honors = data.honorsItems
    .map(
      (item) => `                  <div>
                    <p>${renderRichText(item.year)}</p>
                    <p>${renderRichText(item.title)}</p>
                  </div>`
    )
    .join('\n');

  const publications = data.publications
    .map((item, index) => {
      const links = item.links
        .map((link) => `                        <a class="stitch-pub-badge-link" href="${escapeHtml(getLinkHref(link.href))}">${renderRichText(link.label)}<span class="material-symbols-outlined">arrow_outward</span></a>`)
        .join('\n');
      const idAttr = index === ARTICLE_START_INDEX ? ' id="press"' : '';
      const hiddenStyle = index >= 3 ? ' style="display:none;" class="stitch-pub-collapsible"' : '';
      return `                  <li${idAttr}${hiddenStyle}>
                    <div class="stitch-pub-entry">
                      <div class="stitch-pub-meta">
                        <span class="stitch-pub-journal">${renderRichText(item.journal)}</span>
                        <span class="stitch-pub-year">${renderRichText(item.year)}</span>
                      </div>
                      <h4 class="stitch-pub-title">${renderRichText(item.title)}</h4>
                      <p class="stitch-pub-authors">${renderRichText(item.authors)}</p>
                      <div class="stitch-pub-links stitch-link-collection">
${links}
                      </div>
                    </div>
                  </li>`;
    })
    .join('\n');

  // Compute live synchronized statistics directly from student lists
  const alumniCount = (data.studentCategories || []).find((c) => c.id === 'phd-alumni')?.students.length || 0;
  const currentCount = (data.studentCategories || []).find((c) => c.id === 'phd-current')?.students.length || 0;
  const postdocCount = (data.studentCategories || []).find((c) => c.id === 'postdocs')?.students.length || 0;
  const mastersCount = (data.studentCategories || []).find((c) => c.id === 'masters')?.students.length || 0;
  const totalPhdCount = alumniCount + currentCount;

  const studentCategoryTabs = (data.studentCategories || [])
    .map((cat, idx) => `              <button type="button" class="stitch-tab-btn${idx === 0 ? ' is-active' : ''}" data-tab="${cat.id}" role="tab" aria-selected="${idx === 0 ? 'true' : 'false'}">
                ${escapeHtml(cat.label)} <span class="stitch-tab-badge">${cat.students.length}</span>
              </button>`)
    .join('\n');

  const customSectionsHtml = (data.customSections || [])
    .map(
      (sec) => `          <section class="stitch-custom-section" id="${escapeHtml(sec.id)}">
            <div class="stitch-split">
              <div><h2>${renderRichText(sec.title)}</h2></div>
              <div>
                <p>${renderRichText(sec.content)}</p>
              </div>
            </div>
          </section>`
    )
    .join('\n');

  const studentCategoryPanels = (data.studentCategories || [])
    .map((cat, idx) => {
      const studentRows = cat.students
        .map(
          (student) => `                  <li class="stitch-advisee-row">
                    <span class="stitch-advisee-bullet">•</span>
                    <div class="stitch-advisee-content">
                      <span class="stitch-advisee-name">
                        ${student.url ? `<a href="${escapeHtml(getLinkHref(student.url))}" target="_blank" rel="noopener noreferrer">${renderRichText(student.name)}<span class="material-symbols-outlined stitch-external-icon">arrow_outward</span></a>` : renderRichText(student.name)}
                      </span>
                      ${student.year ? `<span class="stitch-advisee-year">(${renderRichText(student.year)})</span>` : ''}
                      <span class="stitch-advisee-sep">—</span>
                      <span class="stitch-advisee-placement">${renderRichText(student.placement)}</span>
                    </div>
                  </li>`
        )
        .join('\n');

      return `            <div class="stitch-tab-panel${idx === 0 ? ' is-active' : ''}" id="${cat.id}" role="tabpanel">
              <ul class="stitch-advisee-list">
${studentRows}
              </ul>
            </div>`;
    })
    .join('\n');



  const resourceLinks = data.resourceLinks
    .map((item) => `                <a href="${escapeHtml(getLinkHref(item.href))}">${renderRichText(item.label)}</a>`)
    .join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(data.brand)}</title>
    <!-- Fonts & Icons: Guaranteed exact match with live preview -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="${pageClassName}">
${data.visibility.topbar ? `      <header class="stitch-topbar">
        <div class="stitch-topbar-inner">
          <div class="stitch-brand">${renderRichText(data.brand)}</div>
          <nav class="stitch-topnav">
${topNav}
            <a class="stitch-topnav-cta" href="${escapeHtml(getLinkHref(data.cvHref))}" target="_blank" rel="noopener noreferrer"><span class="material-symbols-outlined">download</span>${renderRichText(data.cvButton)}</a>
          </nav>
        </div>
        <div class="stitch-divider"></div>
      </header>` : ''}
      <div class="${layoutClassName}">
${data.visibility.sidebar ? `        <aside class="stitch-sidebar">
          <div class="stitch-sidebar-head">
            <p>${renderRichText(data.sideTitle)}</p>
            <p>${renderRichText(data.sideSubtitle)}</p>
          </div>
          <nav class="stitch-sidenav">
${sideNav}
          </nav>

        </aside>` : ''}
        <main class="stitch-main">
${data.visibility.hero ? `          <section class="stitch-hero">
            <div class="stitch-hero-media">
              <div class="stitch-portrait-frame">
                <img alt="${escapeHtml(data.profileName)}" src="${escapeHtml(data.portraitSrc)}" />
              </div>
            </div>
            <div class="stitch-hero-copy">
              <div>
                <h1>${renderRichText(data.profileName)}</h1>
                <p>${renderRichText(data.profileTitle)}</p>
              </div>
              <div class="stitch-contact-grid">
                <div>
                  <div class="stitch-contact-row">
                    <span class="material-symbols-outlined">location_on</span>
                    <div>
                      <p>${renderRichText(data.officeLabel)}</p>
                      <p>${renderRichText(data.officeLine1)}</p>
                      <p>${renderRichText(data.officeLine2)}</p>
                    </div>
                  </div>
                  <div class="stitch-contact-row">
                    <span class="material-symbols-outlined">mail</span>
                    <div>
                      <p>${renderRichText(data.emailLabel)}</p>
                      <p>${renderRichText(data.email)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="stitch-contact-row">
                    <span class="material-symbols-outlined">call</span>
                    <div>
                      <p>${renderRichText(data.phoneLabel)}</p>
                      <p>${renderRichText(data.phone)}</p>
                    </div>
                  </div>
                  <div class="stitch-contact-row">
                    <span class="material-symbols-outlined">language</span>
                    <div>
                      <p>${renderRichText(data.webLabel)}</p>
                      <p>${renderRichText(data.web)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>` : ''}
${data.visibility.biography ? `          <section class="stitch-biography" id="biography">
            <div class="stitch-chip-row">
${chips}
            </div>
            <div class="stitch-split">
              <div><h2>${renderRichText(data.biographyTitle)}</h2></div>
              <div>
                <p>${renderRichText(data.biographyP1)}</p>
                <p>${renderRichText(data.biographyP2)}</p>
              </div>
            </div>
          </section>` : ''}
${data.visibility.honors ? `          <section class="stitch-honors" id="honors">
            <div class="stitch-split">
              <div><h2>${renderRichText(data.honorsTitle)}</h2></div>
              <div>
                <span class="stitch-eyebrow">${renderRichText(data.honorsEyebrow)}</span>
                <h3>${renderRichText(data.honorsLeadStart)} <span>${renderRichText(data.honorsLeadEmphasis)}</span>${renderRichText(data.honorsLeadEnd)}</h3>
                <button type="button" class="stitch-inline-btn">${renderRichText(data.honorsReadMore)}</button>
                <div class="stitch-honors-grid">
${honors}
                </div>
              </div>
            </div>
          </section>` : ''}
${data.visibility.publications ? `          <section class="stitch-publications" id="publications">
            <div class="stitch-split">
              <div><h2>${renderRichText(data.publicationsTitle)}</h2></div>
              <div>
                <ul>
${publications}
                </ul>
${data.visibility.loadMore && data.publications.length > 3 ? `                <div class="stitch-loadmore">
                  <button type="button" id="stitchLoadMoreBtn">
                    <span class="stitch-loadmore-text">${renderRichText(data.loadMoreLabel)}</span>
                    <span class="material-symbols-outlined">expand_more</span>
                  </button>
                </div>` : ''}
              </div>
            </div>
          </section>` : ''}
${data.visibility.students ? `          <section class="stitch-students" id="students">
            <div class="stitch-students-header">
              <h2>${renderRichText(data.studentsTitle)}</h2>
            </div>
            <div class="stitch-tabs-container">
              <div class="stitch-tabs-nav" role="tablist">
${studentCategoryTabs}
              </div>
${studentCategoryPanels}
            </div>
          </section>` : ''}
${customSectionsHtml ? '\n' + customSectionsHtml : ''}
        </main>
      </div>
${data.visibility.footer ? `      <footer class="stitch-footer">
        <div class="stitch-footer-inner">
          <div>
            <div>${renderRichText(data.footerBrand)}</div>
            <p>${renderRichText(data.footerTagline)}</p>
          </div>
          <div class="stitch-footer-links">
            <div>
              <p>${renderRichText(data.resourcesTitle)}</p>
              <nav>
${resourceLinks}
              </nav>
            </div>
            <div>
              <p>${renderRichText(data.contactTitle)}</p>
              <p>${renderRichText(data.contactLine1)}<br />${renderRichText(data.contactLine2)}</p>
            </div>
          </div>
        </div>
        <div class="stitch-copyright">${renderRichText(data.copyright)}</div>
      </footer>` : ''}
    </div>
    <script>
      // 1. Interactive Tabs in Students & Advising
      document.querySelectorAll('.stitch-tabs-container').forEach(function(container) {
        var tabs = container.querySelectorAll('.stitch-tab-btn');
        var panels = container.querySelectorAll('.stitch-tab-panel');
        tabs.forEach(function(tab) {
          tab.addEventListener('click', function() {
            var targetId = tab.getAttribute('data-tab');
            tabs.forEach(function(t) {
              t.classList.remove('is-active');
              t.setAttribute('aria-selected', 'false');
            });
            panels.forEach(function(p) {
              p.classList.remove('is-active');
            });
            tab.classList.add('is-active');
            tab.setAttribute('aria-selected', 'true');
            var targetPanel = document.getElementById(targetId);
            if (targetPanel) {
              targetPanel.classList.add('is-active');
            }
          });
        });
      });

      // 2. Load More / Show Fewer Publications
      var loadMoreBtn = document.getElementById('stitchLoadMoreBtn');
      if (loadMoreBtn) {
        var isExpanded = false;
        var defaultLabel = loadMoreBtn.querySelector('.stitch-loadmore-text').textContent;
        loadMoreBtn.addEventListener('click', function() {
          isExpanded = !isExpanded;
          var hiddenItems = document.querySelectorAll('.stitch-pub-collapsible');
          hiddenItems.forEach(function(item) {
            item.style.display = isExpanded ? 'block' : 'none';
          });
          loadMoreBtn.querySelector('.stitch-loadmore-text').textContent = isExpanded ? 'Show Fewer Publications' : defaultLabel;
          var icon = loadMoreBtn.querySelector('.material-symbols-outlined');
          if (icon) icon.textContent = isExpanded ? 'expand_less' : 'expand_more';
        });
      }

      // 3. ScrollSpy & Smooth Sidenav Active Highlighting (matches preview exactly)
      var sideNavLinks = document.querySelectorAll('.stitch-sidenav a');
      var sectionElements = Array.from(sideNavLinks).map(function(link) {
        var id = link.getAttribute('href').replace('#', '');
        return document.getElementById(id);
      }).filter(Boolean);

      if (window.IntersectionObserver && sectionElements.length > 0) {
        var observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              sideNavLinks.forEach(function(link) {
                var isActive = link.getAttribute('href') === '#' + entry.target.id;
                link.classList.toggle('active', isActive);
              });
            }
          });
        }, { rootMargin: '-20% 0px -70% 0px' });

        sectionElements.forEach(function(el) { observer.observe(el); });
      }

      // Smooth scrolling for top navigation links
      document.querySelectorAll('.stitch-topnav a').forEach(function(link) {
        var href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          link.addEventListener('click', function(e) {
            var targetId = href.replace('#', '');
            var targetEl = document.getElementById(targetId);
            if (targetEl) {
              e.preventDefault();
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        }
      });

      // Smooth anchor click scrolling
      sideNavLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
          var targetId = link.getAttribute('href').replace('#', '');
          var targetEl = document.getElementById(targetId);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            sideNavLinks.forEach(function(l) { l.classList.remove('active'); });
            link.classList.add('active');
          }
        });
      });    </script>
  </body>
</html>`;
}

function buildTemplateCss(rawCss: string): string {
  const fontImports = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');`;

  const resetAndBase = `*, *::before, *::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  padding: 0;
}`;

  const markerIndex = rawCss.indexOf(TEMPLATE_EXPORT_MARKER);
  if (markerIndex === -1) {
    return [fontImports, resetAndBase, rawCss.trim()].join('\n\n');
  }

  let templateStyles = rawCss.slice(markerIndex + TEMPLATE_EXPORT_MARKER.length).trim();
  const photoOverlayIdx = templateStyles.indexOf('/* Photo processing overlay & progress */');
  if (photoOverlayIdx !== -1) {
    templateStyles = templateStyles.slice(0, photoOverlayIdx).trim();
  }

  return [fontImports, resetAndBase, templateStyles].join('\n\n');
}

function getPageClassName(visibility: SectionVisibility): string {
  return [
    'stitch-page',
    !visibility.topbar ? 'stitch-page--without-topbar' : '',
    !visibility.sidebar ? 'stitch-page--without-sidebar' : '',
    !visibility.footer ? 'stitch-page--without-footer' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function getLayoutClassName(isSidebarCollapsed: boolean): string {
  return ['stitch-layout', isSidebarCollapsed ? 'left-nav-collapsed' : ''].filter(Boolean).join(' ');
}

function EditableText({
  value,
  onChange,
  editable,
  className,
  as = 'span',
  onFocus,
}: {
  value: string;
  onChange: (next: string) => void;
  editable: boolean;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'a' | 'button' | 'div';
  onFocus?: (element: HTMLElement) => void;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.activeElement === el) return;
    const nextHtml = sanitizeRichText(value);
    if (el.innerHTML !== nextHtml) {
      el.innerHTML = nextHtml;
    }
  }, [value]);

  return React.createElement(as, {
    ref,
    className: `${className || ''} stitch-editable ${editable ? 'is-editable' : 'is-readonly'}`.trim(),
    contentEditable: editable,
    suppressContentEditableWarning: true,
    onInput: (event: React.FormEvent<HTMLElement>) => {
      if (!editable) return;
      onChange(sanitizeRichText(event.currentTarget.innerHTML || ''));
    },
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      if (!editable) return;
      onFocus?.(event.currentTarget);
    },
    dir: 'ltr',
    spellCheck: editable,
  });
}

function LinkSettings({
  href,
  onHrefChange,
  onRemove,
  placeholder,
}: {
  href: string;
  onHrefChange: (next: string) => void;
  onRemove?: () => void;
  placeholder?: string;
}) {
  return (
    <div className="stitch-link-settings">
      <input
        type="url"
        value={href}
        onChange={(event) => onHrefChange(event.target.value)}
        placeholder={placeholder || 'https://example.com'}
        aria-label="Link URL"
      />
      {onRemove && (
        <button type="button" className="stitch-remove-btn" onClick={onRemove}>
          Remove
        </button>
      )}
    </div>
  );
}

export function ProfessorWebsiteBuilder() {
  const [data, setData] = useState<TemplateData>(INITIAL_DATA);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('biography');
  const [activeEditable, setActiveEditable] = useState<HTMLElement | null>(null);
  const [activeStudentTab, setActiveStudentTab] = useState<string>('phd-alumni');
  const INITIAL_PUB_LIMIT = 3;
  const [pubLimit, setPubLimit] = useState<number>(INITIAL_PUB_LIMIT);

  const windowBodyRef = useRef<HTMLDivElement | null>(null);

  // Real-time dynamically synchronized statistics derived from the student advising rosters
  const computedStats = useMemo(() => {
    const alumniCount = data.studentCategories.find((c) => c.id === 'phd-alumni')?.students.length || 0;
    const currentCount = data.studentCategories.find((c) => c.id === 'phd-current')?.students.length || 0;
    const postdocCount = data.studentCategories.find((c) => c.id === 'postdocs')?.students.length || 0;
    const mastersCount = data.studentCategories.find((c) => c.id === 'masters')?.students.length || 0;
    const totalPhd = alumniCount + currentCount;

    return {
      phdTotal: String(totalPhd),
      phdCurrent: String(currentCount),
      phdAlumni: String(alumniCount),
      postdocCurrent: String(postdocCount),
      mastersTotal: String(mastersCount),
    };
  }, [data.studentCategories]);

  const addStudentAdvisee = (catId: string) => {
    setData((prev) => ({
      ...prev,
      studentCategories: prev.studentCategories.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              students: [
                ...cat.students,
                {
                  name: 'New Advisee',
                  year: catId.includes('alumni') ? "PhD '24" : '1st Year',
                  placement: catId.includes('alumni') ? 'Assistant Professor / Industry' : 'Doctoral Research',
                },
              ],
            }
          : cat
      ),
    }));
  };

  const removeStudentAdvisee = (catId: string, studentIdx: number) => {
    setData((prev) => ({
      ...prev,
      studentCategories: prev.studentCategories.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              students: cat.students.filter((_, idx) => idx !== studentIdx),
            }
          : cat
      ),
    }));
  };

  const updateStudentField = (catId: string, studentIdx: number, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      studentCategories: prev.studentCategories.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              students: cat.students.map((st, idx) =>
                idx === studentIdx ? { ...st, [field]: value } : st
              ),
            }
          : cat
      ),
    }));
  };

  const templateCode = useMemo(() => buildTemplateHtml(data), [data]);
  const templateCss = useMemo(() => buildTemplateCss(rawProfessorWebsiteBuilderCss), []);
  const pageClassName = getPageClassName(data.visibility);
  const layoutClassName = getLayoutClassName(!data.visibility.sidebar);
  const sideNavItems = [
    { id: 'biography', label: data.sideNav[0], icon: 'person', visible: data.visibility.biography },
    { id: 'honors', label: data.sideNav[1], icon: 'military_tech', visible: data.visibility.honors },
    { id: 'publications', label: data.sideNav[2], icon: 'menu_book', visible: data.visibility.publications },
    {
      id: 'press',
      label: data.sideNav[3],
      icon: 'newspaper',
      visible: data.visibility.publications && data.publications.length > ARTICLE_START_INDEX,
    },
    { id: 'students', label: 'Students & Advising', icon: 'school', visible: data.visibility.students },
  ].filter((item) => item.visible);
  const sectionControls: Array<{ key: keyof SectionVisibility; label: string }> = [
    { key: 'topbar', label: 'Top Bar' },
    { key: 'sidebar', label: 'Sidebar' },
    { key: 'hero', label: 'Hero' },
    { key: 'biography', label: 'Biography' },
    { key: 'honors', label: 'Honors' },
    { key: 'publications', label: 'Publications' },
    { key: 'students', label: 'Students' },
    { key: 'loadMore', label: 'Load More' },
    { key: 'footer', label: 'Footer' },
  ];

  useEffect(() => {
    if (!isEditMode) {
      setActiveEditable(null);
    }
  }, [isEditMode]);

  useEffect(() => {
    const root = windowBodyRef.current;
    if (!root) return;

    const sectionIds = sideNavItems.map((item) => item.id);
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
  }, [sideNavItems]);

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
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setData((prev) => ({ ...prev, portraitSrc: result }));
      }
    };
    reader.readAsDataURL(file);
    event.currentTarget.value = '';
  };

  const addHonorItem = () => {
    setData((prev) => ({
      ...prev,
      honorsItems: [...prev.honorsItems, { year: 'YYYY', title: 'New honor title' }],
    }));
  };

  const addPublicationItem = () => {
    setData((prev) => {
      const nextPublications = [...prev.publications];
      nextPublications.splice(Math.min(ARTICLE_START_INDEX, nextPublications.length), 0, {
        journal: 'Journal Name',
        year: new Date().getFullYear().toString(),
        title: 'New publication title',
        authors: 'Author, A.',
        links: [{ label: 'PDF', href: '#' }],
      });
      return {
        ...prev,
        publications: nextPublications,
      };
    });
  };

  const addArticleItem = () => {
    setData((prev) => ({
      ...prev,
      publications: [
        ...prev.publications,
        {
          journal: 'Article & Press',
          year: new Date().getFullYear().toString(),
          title: 'New article headline',
          authors: 'Author, A.',
          links: [{ label: 'Read Article', href: '#' }],
        },
      ],
    }));
  };

  const addTopNavLink = () => {
    const secId = `section-${Date.now().toString(36)}`;
    const newSection: CustomSection = {
      id: secId,
      title: 'New Section',
      content: 'Add details, course listings, research descriptions, or announcements here.',
    };

    setData((prev) => ({
      ...prev,
      topNav: [...prev.topNav, { label: 'New Section', href: `#${secId}` }],
      customSections: [...(prev.customSections || []), newSection],
    }));
  };

  const addChip = () => {
    setData((prev) => ({
      ...prev,
      chips: [...prev.chips, 'New Topic'],
    }));
  };

  const addPublicationLink = (publicationIndex: number) => {
    setData((prev) => ({
      ...prev,
      publications: prev.publications.map((entry, idx) =>
        idx === publicationIndex
          ? {
              ...entry,
              links: [...entry.links, { label: 'New Link', href: '#' }],
            }
          : entry
      ),
    }));
  };

  const addResourceLink = () => {
    setData((prev) => ({
      ...prev,
      resourceLinks: [...prev.resourceLinks, { label: 'New Resource', href: '#' }],
    }));
  };

  const applyTextCommand = (command: 'bold' | 'italic' | 'underline' | 'unlink' | 'createLink') => {
    if (!activeEditable) return;

    activeEditable.focus();

    if (command === 'createLink') {
      const url = window.prompt('Enter link URL', 'https://');
      if (!url) return;
      document.execCommand('createLink', false, sanitizeUrl(url));
    } else {
      document.execCommand(command, false);
    }

    activeEditable.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
  };

  const toggleVisibility = (key: keyof SectionVisibility) => {
    setData((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [key]: !prev.visibility[key],
      },
    }));
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
            <label className={`stitch-upload-btn ${isEditMode ? '' : 'is-disabled'}`}>
              Upload Image
              <input type="file" accept="image/*" onChange={onUploadImage} disabled={!isEditMode} />
            </label>
          </div>
        </div>
        {isEditMode && (
          <div className="stitch-format-palette" aria-label="Text formatting palette">
            <button type="button" className="stitch-format-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => applyTextCommand('bold')}>
              Bold
            </button>
            <button type="button" className="stitch-format-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => applyTextCommand('italic')}>
              Italic
            </button>
            <button type="button" className="stitch-format-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => applyTextCommand('underline')}>
              Underline
            </button>
            <button type="button" className="stitch-format-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => applyTextCommand('createLink')}>
              Add Link
            </button>
            <button type="button" className="stitch-format-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => applyTextCommand('unlink')}>
              Remove Link
            </button>
          </div>
        )}
        {isEditMode && (
          <div className="stitch-section-manager" aria-label="Section visibility manager">
            <span className="stitch-section-manager-label">Elements</span>
            {sectionControls.map((control) => (
              <button
                key={control.key}
                type="button"
                className={`stitch-section-toggle ${data.visibility[control.key] ? 'is-visible' : 'is-hidden'}`}
                onClick={() => toggleVisibility(control.key)}
              >
                {data.visibility[control.key] ? `Remove ${control.label}` : `Restore ${control.label}`}
              </button>
            ))}
          </div>
        )}

        <div className="stitch-window-body" ref={windowBodyRef}>
          <div className={pageClassName}>
            {data.visibility.topbar && (
              <header className="stitch-topbar">
                <div className="stitch-topbar-inner">
                  <EditableText editable={isEditMode} value={data.brand} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, brand: next }))} className="stitch-brand" as="div" />
                  <nav className="stitch-topnav">
                    {data.topNav.map((item, index) => (
                      <div key={`top-${index}`} className="stitch-link-stack">
                        <a
                          href={getLinkHref(item.href)}
                          onClick={(event) => {
                            if (isEditMode) {
                              event.preventDefault();
                              return;
                            }
                            if (item.href.startsWith('#')) {
                              event.preventDefault();
                              const targetId = item.href.slice(1);
                              const target = document.getElementById(targetId);
                              if (target) {
                                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                setActiveSectionId(targetId);
                              }
                            }
                          }}
                        >
                          <EditableText
                            editable={isEditMode}
                            onFocus={setActiveEditable}
                            value={item.label}
                            onChange={(next) =>
                              setData((prev) => {
                                const currentItem = prev.topNav[index];
                                const linkedSecId = currentItem?.href?.startsWith('#') ? currentItem.href.slice(1) : null;
                                return {
                                  ...prev,
                                  topNav: prev.topNav.map((entry, idx) => (idx === index ? { ...entry, label: next } : entry)),
                                  customSections: linkedSecId
                                    ? (prev.customSections || []).map((s) => (s.id === linkedSecId ? { ...s, title: next } : s))
                                    : prev.customSections,
                                };
                              })
                            }
                          />
                        </a>
                        {isEditMode && (
                          <LinkSettings
                            href={item.href}
                            onHrefChange={(next) =>
                              setData((prev) => ({
                                ...prev,
                                topNav: prev.topNav.map((entry, idx) => (idx === index ? { ...entry, href: next } : entry)),
                              }))
                            }
                            onRemove={() =>
                              setData((prev) => {
                                const currentItem = prev.topNav[index];
                                const linkedSecId = currentItem?.href?.startsWith('#') ? currentItem.href.slice(1) : null;
                                return {
                                  ...prev,
                                  topNav: prev.topNav.filter((_, idx) => idx !== index),
                                  customSections: linkedSecId
                                    ? (prev.customSections || []).filter((s) => s.id !== linkedSecId)
                                    : prev.customSections,
                                };
                              })
                            }
                          />
                        )}
                      </div>
                    ))}
                    <div className="stitch-link-stack">
                      <a
                        className="stitch-topnav-cta"
                        href={getLinkHref(data.cvHref)}
                        target={data.cvHref && data.cvHref.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        onClick={(event) => isEditMode && event.preventDefault()}
                      >
                        <span className="material-symbols-outlined">download</span>
                        <EditableText editable={isEditMode} value={data.cvButton} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, cvButton: next }))} as="span" />
                      </a>
                      {isEditMode && (
                        <LinkSettings
                          href={data.cvHref}
                          onHrefChange={(next) => setData((prev) => ({ ...prev, cvHref: next }))}
                          placeholder="https://example.com/cv.pdf"
                        />
                      )}
                    </div>
                  </nav>
                </div>
                <div className="stitch-divider" />
                {isEditMode && (
                  <div className="stitch-topnav-actions">
                    <button type="button" className="stitch-add-btn stitch-add-btn--compact" onClick={addTopNavLink}>
                      <span className="material-symbols-outlined">add</span>
                      Add Top Link
                    </button>
                  </div>
                )}
              </header>
            )}

            <div className={layoutClassName}>
              {data.visibility.sidebar && (
                <aside className="stitch-sidebar">
                <div className="stitch-sidebar-head">
                  <EditableText editable={isEditMode} value={data.sideTitle} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, sideTitle: next }))} as="p" />
                  <EditableText editable={isEditMode} value={data.sideSubtitle} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, sideSubtitle: next }))} as="p" />
                </div>
                <nav className="stitch-sidenav">
                  {sideNavItems.map((item) => (
                    <a
                      key={`side-${item.id}`}
                      className={activeSectionId === item.id ? 'active' : undefined}
                      href={`#${item.id}`}
                      onClick={(event) => onSideNavClick(event, item.id)}
                    >
                      <span className="material-symbols-outlined">{item.icon}</span>
                      <EditableText
                        editable={isEditMode}
                        onFocus={setActiveEditable}
                        value={item.label}
                        onChange={(next) =>
                          setData((prev) => ({
                            ...prev,
                            sideNav: prev.sideNav.map((entry, idx) =>
                              (item.id === 'biography' && idx === 0) ||
                              (item.id === 'honors' && idx === 1) ||
                              (item.id === 'publications' && idx === 2) ||
                              (item.id === 'press' && idx === 3)
                                ? next
                                : entry
                            ),
                          }))
                        }
                      />
                    </a>
                  ))}
                </nav>

                </aside>
              )}

              <main className="stitch-main">
                {data.visibility.hero && (
                <section className="stitch-hero">
                  <div className="stitch-hero-media">
                    <div className="stitch-portrait-frame">
                      <img alt={data.profileName} src={data.portraitSrc} />
                    </div>
                  </div>
                  <div className="stitch-hero-copy">
                    <div>
                      <EditableText editable={isEditMode} value={data.profileName} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, profileName: next }))} as="h1" />
                      <EditableText editable={isEditMode} value={data.profileTitle} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, profileTitle: next }))} as="p" />
                    </div>
                    <div className="stitch-contact-grid">
                      <div>
                        <div className="stitch-contact-row">
                          <span className="material-symbols-outlined">location_on</span>
                          <div>
                            <EditableText editable={isEditMode} value={data.officeLabel} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, officeLabel: next }))} as="p" />
                            <EditableText editable={isEditMode} value={data.officeLine1} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, officeLine1: next }))} as="p" />
                            <EditableText editable={isEditMode} value={data.officeLine2} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, officeLine2: next }))} as="p" />
                          </div>
                        </div>
                        <div className="stitch-contact-row">
                          <span className="material-symbols-outlined">mail</span>
                          <div>
                            <EditableText editable={isEditMode} value={data.emailLabel} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, emailLabel: next }))} as="p" />
                            <EditableText editable={isEditMode} value={data.email} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, email: next }))} as="p" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="stitch-contact-row">
                          <span className="material-symbols-outlined">call</span>
                          <div>
                            <EditableText editable={isEditMode} value={data.phoneLabel} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, phoneLabel: next }))} as="p" />
                            <EditableText editable={isEditMode} value={data.phone} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, phone: next }))} as="p" />
                          </div>
                        </div>
                        <div className="stitch-contact-row">
                          <span className="material-symbols-outlined">language</span>
                          <div>
                            <EditableText editable={isEditMode} value={data.webLabel} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, webLabel: next }))} as="p" />
                            <EditableText editable={isEditMode} value={data.web} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, web: next }))} as="p" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                )}

                {data.visibility.biography && (
                <section className="stitch-biography" id="biography">
                  <div className="stitch-chip-row">
                    {data.chips.map((chip, index) => (
                      <div key={`chip-${index}`} className="stitch-chip-item">
                        <EditableText
                          editable={isEditMode}
                          onFocus={setActiveEditable}
                          value={chip}
                          onChange={(next) =>
                            setData((prev) => ({
                              ...prev,
                              chips: prev.chips.map((entry, idx) => (idx === index ? next : entry)),
                            }))
                          }
                          as="span"
                        />
                        {isEditMode && (
                          <button
                            type="button"
                            className="stitch-remove-btn"
                            onClick={() =>
                              setData((prev) => ({
                                ...prev,
                                chips: prev.chips.filter((_, idx) => idx !== index),
                              }))
                            }
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {isEditMode && (
                    <button type="button" className="stitch-add-btn stitch-add-btn--compact" onClick={addChip}>
                      <span className="material-symbols-outlined">add</span>
                      Add Chip
                    </button>
                  )}
                  <div className="stitch-split">
                    <div>
                      <EditableText editable={isEditMode} value={data.biographyTitle} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, biographyTitle: next }))} as="h2" />
                    </div>
                    <div>
                      <EditableText editable={isEditMode} value={data.biographyP1} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, biographyP1: next }))} as="p" />
                      <EditableText editable={isEditMode} value={data.biographyP2} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, biographyP2: next }))} as="p" />
                    </div>
                  </div>
                </section>
                )}

                {data.visibility.honors && (
                <section className="stitch-honors" id="honors">
                  <div className="stitch-split">
                    <div>
                      <EditableText editable={isEditMode} value={data.honorsTitle} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, honorsTitle: next }))} as="h2" />
                    </div>
                    <div>
                      <EditableText editable={isEditMode} value={data.honorsEyebrow} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, honorsEyebrow: next }))} as="span" className="stitch-eyebrow" />
                      <h3>
                        <EditableText editable={isEditMode} value={data.honorsLeadStart} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, honorsLeadStart: next }))} />{' '}
                        <EditableText editable={isEditMode} value={data.honorsLeadEmphasis} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, honorsLeadEmphasis: next }))} as="span" />
                        <EditableText editable={isEditMode} value={data.honorsLeadEnd} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, honorsLeadEnd: next }))} />
                      </h3>
                      <button type="button" className="stitch-inline-btn">
                        <EditableText editable={isEditMode} value={data.honorsReadMore} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, honorsReadMore: next }))} />{' '}
                        <span className="material-symbols-outlined">arrow_right_alt</span>
                      </button>
                      <div className="stitch-honors-grid">
                        {data.honorsItems.map((item, index) => (
                          <div key={`honor-${index}`} className="stitch-card-editor">
                            <EditableText
                              value={item.year}
                              editable={isEditMode}
                              onFocus={setActiveEditable}
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
                              onFocus={setActiveEditable}
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
                            {isEditMode && (
                              <button
                                type="button"
                                className="stitch-remove-btn"
                                onClick={() =>
                                  setData((prev) => ({
                                    ...prev,
                                    honorsItems: prev.honorsItems.filter((_, idx) => idx !== index),
                                  }))
                                }
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      {isEditMode && (
                        <button type="button" className="stitch-add-btn" onClick={addHonorItem}>
                          <span className="material-symbols-outlined">add</span>
                          Add Honor
                        </button>
                      )}
                    </div>
                  </div>
                </section>
                )}

                {data.visibility.publications && (
                <section className="stitch-publications" id="publications">
                  <div className="stitch-split">
                    <div>
                      <EditableText editable={isEditMode} value={data.publicationsTitle} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, publicationsTitle: next }))} as="h2" />
                    </div>
                    <div>
                      <ul>
                        {(isEditMode ? data.publications : data.publications.slice(0, pubLimit)).map((item, index) => (
                          <li key={`pub-${index}`} id={index === ARTICLE_START_INDEX ? 'press' : undefined}>
                            <div className="stitch-pub-entry">
                              <div className="stitch-pub-meta">
                                <EditableText
                                  value={item.journal}
                                  editable={isEditMode}
                                  onFocus={setActiveEditable}
                                  onChange={(next) =>
                                    setData((prev) => ({
                                      ...prev,
                                      publications: prev.publications.map((entry, idx) =>
                                        idx === index ? { ...entry, journal: next } : entry
                                      ),
                                    }))
                                  }
                                  as="span"
                                  className="stitch-pub-journal"
                                />
                                <EditableText
                                  value={item.year}
                                  editable={isEditMode}
                                  onFocus={setActiveEditable}
                                  onChange={(next) =>
                                    setData((prev) => ({
                                      ...prev,
                                      publications: prev.publications.map((entry, idx) =>
                                        idx === index ? { ...entry, year: next } : entry
                                      ),
                                    }))
                                  }
                                  as="span"
                                  className="stitch-pub-year"
                                />
                              </div>
                              <EditableText
                                value={item.title}
                                editable={isEditMode}
                                onFocus={setActiveEditable}
                                onChange={(next) =>
                                  setData((prev) => ({
                                    ...prev,
                                    publications: prev.publications.map((entry, idx) =>
                                      idx === index ? { ...entry, title: next } : entry
                                    ),
                                  }))
                                }
                                as="h4"
                                className="stitch-pub-title"
                              />
                              <EditableText
                                value={item.authors}
                                editable={isEditMode}
                                onFocus={setActiveEditable}
                                onChange={(next) =>
                                  setData((prev) => ({
                                    ...prev,
                                    publications: prev.publications.map((entry, idx) =>
                                      idx === index ? { ...entry, authors: next } : entry
                                    ),
                                  }))
                                }
                                as="p"
                                className="stitch-pub-authors"
                              />
                              <div className="stitch-pub-links stitch-link-collection">
                                {item.links.map((link, linkIndex) => (
                                  <div key={`link-${index}-${linkIndex}`} className="stitch-link-stack">
                                    <a
                                      className="stitch-pub-badge-link"
                                      href={getLinkHref(link.href)}
                                      onClick={(event) => isEditMode && event.preventDefault()}
                                    >
                                      <EditableText
                                        value={link.label}
                                        editable={isEditMode}
                                        onFocus={setActiveEditable}
                                        onChange={(next) =>
                                          setData((prev) => ({
                                            ...prev,
                                            publications: prev.publications.map((entry, idx) =>
                                              idx === index
                                                ? {
                                                    ...entry,
                                                    links: entry.links.map((entryLink, entryLinkIndex) =>
                                                      entryLinkIndex === linkIndex ? { ...entryLink, label: next } : entryLink
                                                    ),
                                                  }
                                                : entry
                                            ),
                                          }))
                                        }
                                      />
                                      <span className="material-symbols-outlined">arrow_outward</span>
                                    </a>
                                    {isEditMode && (
                                      <LinkSettings
                                        href={link.href}
                                        onHrefChange={(next) =>
                                          setData((prev) => ({
                                            ...prev,
                                            publications: prev.publications.map((entry, idx) =>
                                              idx === index
                                                ? {
                                                    ...entry,
                                                    links: entry.links.map((entryLink, entryLinkIndex) =>
                                                      entryLinkIndex === linkIndex ? { ...entryLink, href: next } : entryLink
                                                    ),
                                                  }
                                                : entry
                                            ),
                                          }))
                                        }
                                        onRemove={() =>
                                          setData((prev) => ({
                                            ...prev,
                                            publications: prev.publications.map((entry, idx) =>
                                              idx === index
                                                ? {
                                                    ...entry,
                                                    links: entry.links.filter((_, entryLinkIndex) => entryLinkIndex !== linkIndex),
                                                  }
                                                : entry
                                            ),
                                          }))
                                        }
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                              {isEditMode && (
                                <div className="stitch-publication-actions">
                                  <button
                                    type="button"
                                    className="stitch-add-btn stitch-add-btn--compact"
                                    onClick={() => addPublicationLink(index)}
                                  >
                                    <span className="material-symbols-outlined">add</span>
                                    Add Link
                                  </button>
                                  <button
                                    type="button"
                                    className="stitch-remove-btn"
                                    onClick={() =>
                                      setData((prev) => ({
                                        ...prev,
                                        publications: prev.publications.filter((_, idx) => idx !== index),
                                      }))
                                    }
                                  >
                                    Remove Item
                                  </button>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                      {isEditMode && (
                        <button type="button" className="stitch-add-btn" onClick={addPublicationItem}>
                          <span className="material-symbols-outlined">add</span>
                          Add Publication
                        </button>
                      )}
                      <div className="stitch-article-actions">
                        {isEditMode && (
                          <button type="button" className="stitch-add-btn" onClick={addArticleItem}>
                            <span className="material-symbols-outlined">add</span>
                            Add Article
                          </button>
                        )}
                      </div>
                      {data.visibility.loadMore && (isEditMode || data.publications.length > INITIAL_PUB_LIMIT) && (
                      <div className="stitch-loadmore">
                        <button
                          type="button"
                          onClick={() => {
                            if (isEditMode) return;
                            if (pubLimit >= data.publications.length) {
                              setPubLimit(INITIAL_PUB_LIMIT);
                            } else {
                              setPubLimit((prev) => Math.min(prev + 3, data.publications.length));
                            }
                          }}
                        >
                          <EditableText
                            editable={isEditMode}
                            value={
                              !isEditMode && pubLimit >= data.publications.length
                                ? 'Show Fewer Publications'
                                : data.loadMoreLabel
                            }
                            onChange={(next) => setData((prev) => ({ ...prev, loadMoreLabel: next }))}
                          />
                          <span className="material-symbols-outlined">
                            {!isEditMode && pubLimit >= data.publications.length ? 'expand_less' : 'expand_more'}
                          </span>
                        </button>
                      </div>
                      )}
                    </div>
                  </div>
                </section>
                )}

                {data.visibility.students && (
                <section className="stitch-students" id="students">
                  <div className="stitch-students-header">
                    <EditableText
                      editable={isEditMode}
                      value={data.studentsTitle}
                      onFocus={setActiveEditable}
                      onChange={(next) => setData((prev) => ({ ...prev, studentsTitle: next }))}
                      as="h2"
                    />
                  </div>



                  <div className="stitch-tabs-container">
                    <div className="stitch-tabs-nav" role="tablist">
                      {data.studentCategories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          className={`stitch-tab-btn ${activeStudentTab === cat.id ? 'is-active' : ''}`}
                          onClick={() => setActiveStudentTab(cat.id)}
                          role="tab"
                          aria-selected={activeStudentTab === cat.id}
                        >
                          {cat.label} <span className="stitch-tab-badge">{cat.students.length}</span>
                        </button>
                      ))}
                    </div>

                    {data.studentCategories
                      .filter((cat) => cat.id === activeStudentTab)
                      .map((cat) => (
                        <div key={cat.id} className="stitch-tab-content">
                          {!isEditMode ? (
                            <ul className="stitch-advisee-list">
                              {cat.students.map((student, idx) => (
                                <li key={idx} className="stitch-advisee-row">
                                  <span className="stitch-advisee-bullet">•</span>
                                  <div className="stitch-advisee-content">
                                    <span className="stitch-advisee-name">
                                      {student.url ? (
                                        <a href={getLinkHref(student.url)} target="_blank" rel="noopener noreferrer">
                                          {student.name}
                                          <span className="material-symbols-outlined stitch-external-icon">arrow_outward</span>
                                        </a>
                                      ) : (
                                        student.name
                                      )}
                                    </span>
                                    {student.year && (
                                      <span className="stitch-advisee-year">({student.year})</span>
                                    )}
                                    <span className="stitch-advisee-sep">—</span>
                                    <span className="stitch-advisee-placement">{student.placement}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="stitch-advisee-edit-list">
                              {cat.students.map((student, studentIdx) => (
                                <div key={`student-edit-${cat.id}-${studentIdx}`} className="stitch-advisee-edit-row">
                                  <input
                                    type="text"
                                    className="stitch-advisee-input stitch-advisee-input--name"
                                    value={student.name}
                                    placeholder="Name"
                                    onChange={(e) => updateStudentField(cat.id, studentIdx, 'name', e.target.value)}
                                  />
                                  <input
                                    type="text"
                                    className="stitch-advisee-input stitch-advisee-input--year"
                                    value={student.year}
                                    placeholder="Year (e.g. '23)"
                                    onChange={(e) => updateStudentField(cat.id, studentIdx, 'year', e.target.value)}
                                  />
                                  <input
                                    type="text"
                                    className="stitch-advisee-input stitch-advisee-input--placement"
                                    value={student.placement}
                                    placeholder="Current Placement / Focus"
                                    onChange={(e) => updateStudentField(cat.id, studentIdx, 'placement', e.target.value)}
                                  />
                                  <input
                                    type="url"
                                    className="stitch-advisee-input stitch-advisee-input--url"
                                    value={student.url || ''}
                                    placeholder="Website (optional)"
                                    onChange={(e) => updateStudentField(cat.id, studentIdx, 'url', e.target.value)}
                                  />
                                  <button
                                    type="button"
                                    className="stitch-advisee-del-btn"
                                    title="Remove Advisee"
                                    onClick={() => removeStudentAdvisee(cat.id, studentIdx)}
                                  >
                                    <span className="material-symbols-outlined">close</span>
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                className="stitch-add-btn stitch-add-btn--compact"
                                onClick={() => addStudentAdvisee(cat.id)}
                              >
                                <span className="material-symbols-outlined">add</span>
                                Add Advisee to {cat.label}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </section>
                )}

                {(data.customSections || []).map((sec, secIdx) => (
                  <section key={sec.id} className="stitch-custom-section" id={sec.id}>
                    <div className="stitch-split">
                      <div>
                        <EditableText
                          editable={isEditMode}
                          value={sec.title}
                          onFocus={setActiveEditable}
                          onChange={(next) => {
                            setData((prev) => ({
                              ...prev,
                              customSections: prev.customSections.map((s, idx) =>
                                idx === secIdx ? { ...s, title: next } : s
                              ),
                              topNav: prev.topNav.map((item) =>
                                item.href === `#${sec.id}` ? { ...item, label: next } : item
                              ),
                            }));
                          }}
                          as="h2"
                        />
                        {isEditMode && (
                          <button
                            type="button"
                            className="stitch-remove-btn"
                            style={{ marginTop: '0.75rem', display: 'block' }}
                            onClick={() => {
                              setData((prev) => ({
                                ...prev,
                                customSections: prev.customSections.filter((_, idx) => idx !== secIdx),
                                topNav: prev.topNav.filter((item) => item.href !== `#${sec.id}`),
                              }));
                            }}
                          >
                            Remove Section
                          </button>
                        )}
                      </div>
                      <div>
                        <EditableText
                          editable={isEditMode}
                          value={sec.content}
                          onFocus={setActiveEditable}
                          onChange={(next) =>
                            setData((prev) => ({
                              ...prev,
                              customSections: prev.customSections.map((s, idx) =>
                                idx === secIdx ? { ...s, content: next } : s
                              ),
                            }))
                          }
                          as="p"
                        />
                      </div>
                    </div>
                  </section>
                ))}
              </main>
            </div>

            {data.visibility.footer && (
            <footer className="stitch-footer">
              <div className="stitch-footer-inner">
                <div>
                  <EditableText editable={isEditMode} value={data.footerBrand} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, footerBrand: next }))} as="div" />
                  <EditableText editable={isEditMode} value={data.footerTagline} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, footerTagline: next }))} as="p" />
                </div>
                <div className="stitch-footer-links">
                  <div>
                    <EditableText editable={isEditMode} value={data.resourcesTitle} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, resourcesTitle: next }))} as="p" />
                    <nav>
                      {data.resourceLinks.map((item, index) => (
                        <div key={`resource-${index}`} className="stitch-link-stack">
                          <a href={getLinkHref(item.href)} onClick={(event) => isEditMode && event.preventDefault()}>
                            <EditableText
                              editable={isEditMode}
                              onFocus={setActiveEditable}
                              value={item.label}
                              onChange={(next) =>
                                setData((prev) => ({
                                  ...prev,
                                  resourceLinks: prev.resourceLinks.map((entry, idx) => (idx === index ? { ...entry, label: next } : entry)),
                                }))
                              }
                            />
                          </a>
                          {isEditMode && (
                            <LinkSettings
                              href={item.href}
                              onHrefChange={(next) =>
                                setData((prev) => ({
                                  ...prev,
                                  resourceLinks: prev.resourceLinks.map((entry, idx) => (idx === index ? { ...entry, href: next } : entry)),
                                }))
                              }
                              onRemove={() =>
                                setData((prev) => ({
                                  ...prev,
                                  resourceLinks: prev.resourceLinks.filter((_, idx) => idx !== index),
                                }))
                              }
                            />
                          )}
                        </div>
                      ))}
                    </nav>
                    {isEditMode && (
                      <button type="button" className="stitch-add-btn stitch-add-btn--compact" onClick={addResourceLink}>
                        <span className="material-symbols-outlined">add</span>
                        Add Resource Link
                      </button>
                    )}
                  </div>
                  <div>
                    <EditableText editable={isEditMode} value={data.contactTitle} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, contactTitle: next }))} as="p" />
                    <p>
                      <EditableText editable={isEditMode} value={data.contactLine1} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, contactLine1: next }))} />
                      <br />
                      <EditableText editable={isEditMode} value={data.contactLine2} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, contactLine2: next }))} />
                    </p>
                  </div>
                </div>
              </div>
              <EditableText editable={isEditMode} value={data.copyright} onFocus={setActiveEditable} onChange={(next) => setData((prev) => ({ ...prev, copyright: next }))} className="stitch-copyright" as="div" />
            </footer>
            )}
          </div>
        </div>
      </div>

      <div className="stitch-code-grid">
        <section className="stitch-code-panel" aria-label="Template HTML output">
          <h3>Template HTML (auto-updated)</h3>
          <textarea value={templateCode} readOnly />
        </section>
        <section className="stitch-code-panel" aria-label="Template CSS output">
          <h3>Template CSS (auto-updated)</h3>
          <textarea value={templateCss} readOnly />
        </section>
      </div>
    </div>
  );
}
