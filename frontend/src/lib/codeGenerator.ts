import { CanvasElement } from '@/contexts/BuilderContext';

// This file uses server-side rendering to capture the actual rendered output
// Import will be added dynamically when needed

export function generateReactTailwind(elements: CanvasElement[]): string {
  const elementsCode = elements.map((element) => {
    const styles = {
      position: 'absolute' as const,
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      ...(element.props?.styles || {}),
    };
    
    // Add direct props
    if (element.props?.backgroundColor) styles.backgroundColor = element.props.backgroundColor;
    if (element.props?.background) styles.background = element.props.background;
    if (element.props?.color) styles.color = element.props.color;
    if (element.props?.textColor) styles.color = element.props.textColor;
    
    const styleStr = JSON.stringify(styles, null, 2);
    const propsStr = JSON.stringify(element.props || {}, null, 2);
    
    return `      {/* ${element.type}: ${element.label} */}
      {/* Props: ${propsStr.split('\n').join('\n      // ')} */}
      <div
        data-type="${element.type}"
        data-id="${element.id}"
        style={${styleStr}}
      />`;
  }).join('\n\n');

  return `import React from 'react';

export default function GeneratedPage() {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#0f172a' }}>
${elementsCode}
    </div>
  );
}
`;
}

export function generateHTML(elements: CanvasElement[]): string {
  return '<!DOCTYPE html><html><body>HTML Export</body></html>';
}

export function generateReactCode(elements: CanvasElement[]): string {
  return generateReactTailwind(elements);
}

export function generateCSS(elements: CanvasElement[]): string {
  return '/* CSS Export */';
}
