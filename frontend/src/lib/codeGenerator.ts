import { CanvasElement } from '@/contexts/BuilderContext';

// Generate inline styles from element props
function generateStyles(element: CanvasElement): string {
  const styles = element.props?.styles as Record<string, string> || {};

  // Read color props directly from element.props (not just from styles object)
  const directProps: Record<string, string> = {};
  if (element.props?.backgroundColor) directProps.backgroundColor = element.props.backgroundColor as string;
  if (element.props?.textColor) directProps.color = element.props.textColor as string;
  if (element.props?.background) directProps.background = element.props.background as string;
  if (element.props?.accentColor) directProps['--accent-color'] = element.props.accentColor as string;

  const defaultStyles: Record<string, Record<string, string>> = {
    button: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      fontSize: '14px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '500',
    },
    text: {
      color: '#f8fafc',
      fontSize: '16px',
      padding: '8px',
    },
    navbar: {
      backgroundColor: '#0f172a',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
    },
    hero: {
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '32px',
    },
    section: {
      backgroundColor: '#0f172a',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      backgroundColor: '#1e293b',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    card: {
      backgroundColor: '#1e293b',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.08)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
  };

  // Merge: defaults < nested styles < direct props (highest priority)
  const mergedStyles = { ...defaultStyles[element.type] || {}, ...styles, ...directProps };

  return Object.entries(mergedStyles)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssKey}: ${value}`;
    })
    .join('; ');
}

// Generate HTML content for each element type
function generateElementHTML(element: CanvasElement, indent: string = ''): string {
  const styles = generateStyles(element);
  const positionStyles = `position: absolute; left: ${element.x}px; top: ${element.y}px; width: ${element.width}px; height: ${element.height}px;`;

  switch (element.type) {
    case 'button':
      return `${indent}<button style="${positionStyles} ${styles}">${element.props?.text || element.label || 'Button'}</button>`;

    case 'text':
      return `${indent}<div style="${positionStyles} ${styles}">${element.props?.text || element.label || 'Text content'}</div>`;

    case 'navbar': {
      const brandName = (element.props?.brandName as string) || 'Acme';
      const ctaText = (element.props?.ctaText as string) || (element.props?.text as string) || 'Get Started';
      const accentColor = (element.props?.accentColor as string) || '#3b82f6';
      const signInText = (element.props?.signInText as string) || 'Sign in';
      return `${indent}<nav style="${positionStyles} ${styles}">
${indent}  <div style="display: flex; align-items: center; gap: 8px;">
${indent}    <div style="width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, ${accentColor}, #9333ea);"></div>
${indent}    <span style="font-weight: 600; color: white;">${brandName}</span>
${indent}  </div>
${indent}  <div style="display: flex; gap: 24px; font-size: 14px; color: #d1d5db;">
${indent}    <a href="#" style="color: inherit; text-decoration: none;">Products</a>
${indent}    <a href="#" style="color: inherit; text-decoration: none;">Solutions</a>
${indent}    <a href="#" style="color: inherit; text-decoration: none;">Pricing</a>
${indent}    <a href="#" style="color: inherit; text-decoration: none;">Company</a>
${indent}  </div>
${indent}  <div style="display: flex; align-items: center; gap: 16px;">
${indent}    <a href="#" style="color: #d1d5db; text-decoration: none; font-size: 14px;">${signInText}</a>
${indent}    <button style="padding: 8px 16px; background: ${accentColor}; color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">${ctaText}</button>
${indent}  </div>
${indent}</nav>`;
    }

    case 'hero': {
      const heading = (element.props?.heading as string) || 'Build products faster than ever';
      const subheading = (element.props?.subheading as string) || 'The modern platform for building beautiful, responsive websites.';
      const accentColor = (element.props?.accentColor as string) || '#3b82f6';
      const textColor = (element.props?.textColor as string) || 'white';
      const ctaText = (element.props?.ctaText as string) || 'Get Started';
      return `${indent}<section style="${positionStyles} ${styles}">
${indent}  <h1 style="font-size: 48px; font-weight: 700; color: ${textColor}; margin-bottom: 16px;">${heading}</h1>
${indent}  <p style="font-size: 18px; color: #d1d5db; margin-bottom: 32px; max-width: 600px;">${subheading}</p>
${indent}  <div style="display: flex; gap: 16px;">
${indent}    <button style="padding: 12px 24px; background: white; color: #0f172a; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Start for free</button>
${indent}    <button style="padding: 12px 24px; background: transparent; color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; font-weight: 500; cursor: pointer;">View demo →</button>
${indent}  </div>
${indent}</section>`;
    }

    case 'section':
      return `${indent}<section style="${positionStyles} ${styles}">
${indent}  <div style="text-align: center;">
${indent}    <h2 style="font-size: 24px; font-weight: 600; color: white; margin-bottom: 8px;">${element.props?.title || 'Section Title'}</h2>
${indent}    <p style="color: #9ca3af;">${element.props?.description || 'Add your content here'}</p>
${indent}  </div>
${indent}</section>`;

    case 'image':
      const src = element.props?.src as string;
      if (src) {
        return `${indent}<img src="${src}" alt="${element.props?.alt || 'Image'}" style="${positionStyles} ${styles} object-fit: cover;" />`;
      }
      return `${indent}<div style="${positionStyles} ${styles}">
${indent}  <svg width="48" height="48" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
${indent}    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
${indent}  </svg>
${indent}</div>`;

    case 'card':
      return `${indent}<div style="${positionStyles} ${styles}">
${indent}  <div style="height: 50%; background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(147,51,234,0.2)); display: flex; align-items: center; justify-content: center;">
${indent}    <svg width="40" height="40" fill="none" stroke="#6b7280" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
${indent}  </div>
${indent}  <div style="flex: 1; padding: 16px; display: flex; flex-direction: column;">
${indent}    <h3 style="font-size: 18px; font-weight: 600; color: white; margin-bottom: 4px;">${element.props?.title || 'Card Title'}</h3>
${indent}    <p style="font-size: 14px; color: #9ca3af; flex: 1;">${element.props?.description || 'Card description goes here.'}</p>
${indent}    <a href="#" style="margin-top: 12px; font-size: 14px; color: #60a5fa; text-decoration: none; font-weight: 500;">Learn more →</a>
${indent}  </div>
${indent}</div>`;

    default:
      return `${indent}<div style="${positionStyles} background: #374151; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #9ca3af;">Unknown: ${element.type}</div>`;
  }
}

// Generate complete HTML page
export function generateHTML(elements: CanvasElement[]): string {
  const elementsHTML = elements
    .map(el => generateElementHTML(el, '    '))
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #0a0a0f;
      min-height: 100vh;
    }
    .canvas-container {
      position: relative;
      width: 100%;
      min-height: 100vh;
    }
  </style>
</head>
<body>
  <div class="canvas-container">
${elementsHTML}
  </div>
</body>
</html>`;
}

// Generate React component code
export function generateReactCode(elements: CanvasElement[]): string {
  const generateReactElement = (element: CanvasElement, indent: string = ''): string => {
    const styleObj: Record<string, string | number> = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
    };

    const elementStyles = element.props?.styles as Record<string, string> || {};
    Object.assign(styleObj, elementStyles);

    const styleString = JSON.stringify(styleObj, null, 2)
      .split('\n')
      .map((line, i) => i === 0 ? line : `${indent}      ${line}`)
      .join('\n');

    switch (element.type) {
      case 'button':
        return `${indent}<button
${indent}  style={${styleString}}
${indent}  className="hover:opacity-90 transition-opacity"
${indent}>
${indent}  ${element.props?.text || element.label || 'Button'}
${indent}</button>`;

      case 'text':
        return `${indent}<p style={${styleString}}>
${indent}  ${element.props?.text || element.label || 'Text content'}
${indent}</p>`;

      case 'navbar':
        return `${indent}<nav style={${styleString}}>
${indent}  <div className="flex items-center gap-2">
${indent}    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
${indent}    <span className="font-semibold text-white">Brand</span>
${indent}  </div>
${indent}  <div className="flex items-center gap-6 text-sm text-gray-300">
${indent}    <a href="#">Home</a>
${indent}    <a href="#">About</a>
${indent}    <a href="#">Services</a>
${indent}    <a href="#">Contact</a>
${indent}  </div>
${indent}  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">
${indent}    Get Started
${indent}  </button>
${indent}</nav>`;

      case 'hero':
        return `${indent}<section style={${styleString}}>
${indent}  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
${indent}    ${element.props?.heading || 'Build Something Amazing'}
${indent}  </h1>
${indent}  <p className="text-lg text-gray-300 mb-8 max-w-xl">
${indent}    ${element.props?.subheading || 'Create stunning websites with our intuitive drag-and-drop builder.'}
${indent}  </p>
${indent}  <div className="flex items-center gap-4">
${indent}    <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg">
${indent}      Get Started
${indent}    </button>
${indent}    <button className="px-6 py-3 bg-white/10 text-white font-medium rounded-lg border border-white/20">
${indent}      Learn More
${indent}    </button>
${indent}  </div>
${indent}</section>`;

      case 'section':
        return `${indent}<section style={${styleString}}>
${indent}  <div className="text-center">
${indent}    <h2 className="text-2xl font-semibold text-white mb-2">
${indent}      ${element.props?.title || 'Section Title'}
${indent}    </h2>
${indent}    <p className="text-gray-400">
${indent}      ${element.props?.description || 'Add your content here'}
${indent}    </p>
${indent}  </div>
${indent}</section>`;

      case 'image':
        const src = element.props?.src as string;
        if (src) {
          return `${indent}<img src="${src}" alt="${element.props?.alt || 'Image'}" style={${styleString}} className="object-cover" />`;
        }
        return `${indent}<div style={${styleString}} className="flex items-center justify-center bg-slate-800 rounded-lg">
${indent}  <span className="text-gray-500">Image Placeholder</span>
${indent}</div>`;

      case 'card':
        return `${indent}<div style={${styleString}}>
${indent}  <div className="h-1/2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
${indent}    <span className="text-gray-500">Card Image</span>
${indent}  </div>
${indent}  <div className="flex-1 p-4 flex flex-col">
${indent}    <h3 className="text-lg font-semibold text-white mb-1">
${indent}      ${element.props?.title || 'Card Title'}
${indent}    </h3>
${indent}    <p className="text-sm text-gray-400 flex-1">
${indent}      ${element.props?.description || 'Card description goes here.'}
${indent}    </p>
${indent}    <a href="#" className="mt-3 text-sm text-blue-400 font-medium">Learn more →</a>
${indent}  </div>
${indent}</div>`;

      default:
        return `${indent}<div style={${styleString}}>Unknown: ${element.type}</div>`;
    }
  };

  const elementsJSX = elements
    .map(el => generateReactElement(el, '      '))
    .join('\n\n');

  return `import React from 'react';

export default function MyPage() {
  return (
    <div className="relative min-h-screen bg-slate-950">
${elementsJSX}
    </div>
  );
}
`;
}

// Generate CSS-only version (for use with the HTML)
export function generateCSS(elements: CanvasElement[]): string {
  let css = `/* Generated styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #0a0a0f;
  min-height: 100vh;
}

.canvas-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

`;

  elements.forEach((element, index) => {
    css += `.element-${index} {
  position: absolute;
  left: ${element.x}px;
  top: ${element.y}px;
  width: ${element.width}px;
  height: ${element.height}px;
}

`;
  });

  return css;
}

// Generate React component with Tailwind CSS
export function generateReactTailwind(elements: CanvasElement[]): string {
  const generateTailwindElement = (element: CanvasElement): string => {
    const customStyles = element.props?.styles as Record<string, string> || {};

    // Build custom style object for non-Tailwind properties
    // Read from both customStyles and directly from element.props
    const styleEntries: string[] = [];
    const bgColor = (element.props?.backgroundColor as string) || customStyles.backgroundColor;
    const background = (element.props?.background as string) || customStyles.background;
    const textColor = (element.props?.textColor as string) || customStyles.color;

    if (bgColor) styleEntries.push(`backgroundColor: '${bgColor}'`);
    if (background) styleEntries.push(`background: '${background}'`);
    if (textColor) styleEntries.push(`color: '${textColor}'`);
    const customStyleStr = styleEntries.length > 0 ? ` style={{ ${styleEntries.join(', ')} }}` : '';

    switch (element.type) {
      case 'button':
        return `      {/* Button */}
      <button
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"${customStyleStr}
      >
        ${element.props?.text || element.label || 'Button'}
      </button>`;

      case 'text':
        return `      {/* Text */}
      <p className="text-slate-200 text-base"${customStyleStr}>
        ${element.props?.text || element.label || 'Text content'}
      </p>`;

      case 'navbar':
        return `      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-slate-900 border-b border-slate-800"${customStyleStr}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
          <span className="font-bold text-white text-lg">Brand</span>
        </div>
        <div className="flex items-center gap-8 text-sm text-slate-300">
          <a href="#" className="hover:text-white transition-colors">Products</a>
          <a href="#" className="hover:text-white transition-colors">Solutions</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">Company</a>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-300 hover:text-white cursor-pointer">Sign in</span>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
            Get Started
          </button>
        </div>
      </nav>`;

      case 'hero':
        return `      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center py-24 px-8 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-center relative overflow-hidden"${customStyleStr}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 mb-6">
            <span className="text-xs text-blue-400 font-medium">✨ Announcing v2.0</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            ${element.props?.heading || 'Build products faster than ever'}
          </h1>
          <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
            ${element.props?.subheading || 'The modern platform for building beautiful, responsive websites.'}
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors">
              Start for free
            </button>
            <button className="px-6 py-3 bg-transparent text-white font-medium rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors">
              View demo →
            </button>
          </div>
        </div>
      </section>`;

      case 'section':
        return `      {/* Section */}
      <section className="w-full py-16 px-8 bg-slate-900 rounded-2xl border border-slate-800"${customStyleStr}>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            ${element.props?.title || 'Section Title'}
          </h2>
          <p className="text-slate-400">
            ${element.props?.description || 'Add your content here'}
          </p>
        </div>
      </section>`;

      case 'image':
        const src = element.props?.src as string;
        if (src) {
          return `      {/* Image */}
      <img 
        src="${src}" 
        alt="${element.props?.alt || 'Image'}" 
        className="w-full h-full object-cover rounded-lg"
      />`;
        }
        return `      {/* Image Placeholder */}
      <div className="w-full h-64 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
        <span className="text-slate-500 text-sm">Image Placeholder</span>
      </div>`;

      case 'card':
        return `      {/* Card */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden"${customStyleStr}>
        <div className="h-40 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
          <span className="text-slate-500">Card Image</span>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            ${element.props?.title || 'Card Title'}
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            ${element.props?.description || 'Card description goes here.'}
          </p>
          <a href="#" className="text-sm text-blue-400 font-medium hover:text-blue-300">
            Learn more →
          </a>
        </div>
      </div>`;

      case 'marquee':
        return `      {/* Logo Cloud / Marquee */}
      <section className="w-full py-12 bg-slate-950">
        <p className="text-center text-xs text-slate-500 uppercase tracking-widest mb-8">
          Trusted by leading companies
        </p>
        <div className="flex items-center justify-center gap-12 opacity-60">
          {['Vercel', 'Stripe', 'Notion', 'Linear', 'Figma', 'Framer'].map((name) => (
            <div key={name} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-500/30" />
              <span className="text-slate-400 font-semibold">{name}</span>
            </div>
          ))}
        </div>
      </section>`;

      case 'features':
        return `      {/* Features Section */}
      <section className="w-full py-20 px-8 bg-slate-950">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Everything you need</h2>
          <p className="text-slate-400">Packed with features to help you build faster</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { icon: '⚡', title: 'Lightning Fast', desc: 'Built for speed from the ground up' },
            { icon: '🔒', title: 'Secure by Default', desc: 'Enterprise-grade security included' },
            { icon: '📱', title: 'Fully Responsive', desc: 'Looks great on any device' },
            { icon: '🎨', title: 'Customizable', desc: 'Make it truly yours' },
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <span className="text-xl">{feature.icon}</span>
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>`;

      case 'testimonials':
        return `      {/* Testimonials Section */}
      <section className="w-full py-20 px-8 bg-slate-950">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Loved by thousands</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { name: 'Sarah Chen', role: 'CEO at TechCorp', text: 'This product has completely transformed how we build.' },
            { name: 'Marcus Johnson', role: 'Designer at Studio', text: 'The best tool I have ever used. Highly recommended.' },
            { name: 'Emily Davis', role: 'Developer', text: 'Incredible speed and flexibility. Love it!' },
          ].map((testimonial, i) => (
            <div key={i} className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <p className="text-slate-300 mb-4">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600" />
                <div>
                  <p className="text-white font-medium text-sm">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>`;

      case 'pricing':
        return `      {/* Pricing Section */}
      <section className="w-full py-20 px-8 bg-slate-950">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Simple pricing</h2>
          <p className="text-slate-400">Choose the plan that's right for you</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { name: 'Starter', price: '$9', features: ['5 projects', 'Basic analytics', 'Email support'], popular: false },
            { name: 'Pro', price: '$29', features: ['Unlimited projects', 'Advanced analytics', 'Priority support'], popular: true },
            { name: 'Enterprise', price: 'Custom', features: ['Custom solutions', 'Dedicated support', 'SLA guarantee'], popular: false },
          ].map((plan, i) => (
            <div 
              key={i} 
              className={\`p-6 rounded-xl relative \${plan.popular ? 'bg-blue-600/10 border-2 border-blue-500' : 'bg-slate-900 border border-slate-800'}\`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                  Popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-white mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-white mb-4">
                {plan.price}<span className="text-sm font-normal text-slate-400">/mo</span>
              </p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, j) => (
                  <li key={j} className="text-sm text-slate-400">✓ {feature}</li>
                ))}
              </ul>
              <button 
                className={\`w-full py-2.5 rounded-lg font-medium text-sm \${
                  plan.popular 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-transparent text-white border border-slate-700 hover:bg-slate-800'
                } transition-colors\`}
              >
                Get started
              </button>
            </div>
          ))}
        </div>
      </section>`;

      case 'faq':
        return `      {/* FAQ Section */}
      <section className="w-full py-20 px-8 bg-slate-950">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Frequently asked questions</h2>
          <p className="text-slate-400">Everything you need to know</p>
        </div>
        <div className="max-w-2xl mx-auto space-y-4">
          {[
            { q: 'How does the free trial work?', a: 'You get 14 days of full access with no credit card required.' },
            { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time.' },
            { q: 'Do you offer refunds?', a: 'We offer a 30-day money back guarantee.' },
          ].map((faq, i) => (
            <div key={i} className="p-5 bg-slate-900 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">{faq.q}</h3>
                <span className="text-slate-500">+</span>
              </div>
              <p className="text-sm text-slate-400 mt-3">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>`;

      case 'footer':
        return `      {/* Footer */}
      <footer className="w-full py-12 px-8 bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-blue-600" />
              <span className="font-semibold text-white">Acme</span>
            </div>
            <p className="text-sm text-slate-500">Build better, faster.</p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Changelog'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers'] },
            { title: 'Legal', links: ['Privacy', 'Terms'] },
          ].map((section, i) => (
            <div key={i}>
              <h4 className="text-sm font-semibold text-white mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500">© 2024 Acme Inc. All rights reserved.</p>
          <div className="flex gap-4">
            {['Twitter', 'GitHub', 'Discord'].map((social) => (
              <a key={social} href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </footer>`;

      default:
        return `      {/* Unknown Element: ${element.type} */}
      <div className="p-4 bg-slate-800 rounded-lg text-slate-400 text-sm">
        Unknown: ${element.type}
      </div>`;
    }
  };

  const elementsJSX = elements
    .map(el => generateTailwindElement(el))
    .join('\n\n');

  return `import React from 'react';

/**
 * Generated with CanvasX Builder
 * 
 * Requirements:
 * - React 18+
 * - Tailwind CSS 3.x
 * 
 * Add to tailwind.config.js:
 * - darkMode: 'class'
 * - Add Inter font to fontFamily
 */

export default function GeneratedPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
${elementsJSX}
    </div>
  );
}
`;
}
