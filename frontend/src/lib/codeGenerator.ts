import { CanvasElement } from '@/contexts/BuilderContext';

// Generate inline styles from element props
function generateStyles(element: CanvasElement): string {
    const styles = element.props?.styles as Record<string, string> || {};
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

    const mergedStyles = { ...defaultStyles[element.type] || {}, ...styles };

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

        case 'navbar':
            return `${indent}<nav style="${positionStyles} ${styles}">
${indent}  <div style="display: flex; align-items: center; gap: 8px;">
${indent}    <div style="width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #3b82f6, #9333ea);"></div>
${indent}    <span style="font-weight: 600; color: white;">Brand</span>
${indent}  </div>
${indent}  <div style="display: flex; gap: 24px; font-size: 14px; color: #d1d5db;">
${indent}    <a href="#" style="color: inherit; text-decoration: none;">Home</a>
${indent}    <a href="#" style="color: inherit; text-decoration: none;">About</a>
${indent}    <a href="#" style="color: inherit; text-decoration: none;">Services</a>
${indent}    <a href="#" style="color: inherit; text-decoration: none;">Contact</a>
${indent}  </div>
${indent}  <button style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">Get Started</button>
${indent}</nav>`;

        case 'hero':
            return `${indent}<section style="${positionStyles} ${styles}">
${indent}  <h1 style="font-size: 48px; font-weight: 700; color: white; margin-bottom: 16px;">${element.props?.heading || 'Build Something Amazing'}</h1>
${indent}  <p style="font-size: 18px; color: #d1d5db; margin-bottom: 32px; max-width: 600px;">${element.props?.subheading || 'Create stunning websites with our intuitive drag-and-drop builder.'}</p>
${indent}  <div style="display: flex; gap: 16px;">
${indent}    <button style="padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">Get Started</button>
${indent}    <button style="padding: 12px 24px; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; font-weight: 500; cursor: pointer;">Learn More</button>
${indent}  </div>
${indent}</section>`;

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
