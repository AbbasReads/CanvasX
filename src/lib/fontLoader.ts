// Dynamic Google Fonts loader
const loadedFonts = new Set<string>();

export function loadGoogleFont(fontFamily: string): void {
    // Normalize font name for Google Fonts URL
    const normalizedFont = fontFamily.replace(/\s+/g, '+');
    
    // Check if already loaded
    if (loadedFonts.has(fontFamily)) {
        return;
    }

    // Create and append link element for Google Fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${normalizedFont}:wght@300;400;500;600;700;800;900&display=swap`;
    
    document.head.appendChild(link);
    loadedFonts.add(fontFamily);
    
    console.log(`Loaded Google Font: ${fontFamily}`);
}

// Load font when fontFamily style is set
export function ensureFontLoaded(fontFamily: string | undefined): void {
    if (!fontFamily) return;
    
    // Skip if it's a system font
    const systemFonts = [
        'Arial', 'Helvetica', 'Times New Roman', 'Times', 'Courier New', 'Courier',
        'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Comic Sans MS', 'Trebuchet MS',
        'Arial Black', 'Impact', 'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'
    ];
    
    if (systemFonts.some(font => fontFamily.toLowerCase().includes(font.toLowerCase()))) {
        return;
    }
    
    // Load from Google Fonts
    loadGoogleFont(fontFamily);
}
