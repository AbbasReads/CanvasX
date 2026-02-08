import { Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { withInteractable } from '@tambo-ai/react';
import { z } from 'zod';

interface FooterProps {
  brandName?: string;
  copyrightYear?: string;
  copyrightText?: string;
  termsText?: string;
  privacyText?: string;
  docsText?: string;
  termsUrl?: string;
  privacyUrl?: string;
  docsUrl?: string;
}

function FooterBase({
  brandName = 'Spatial',
  copyrightYear = '2024',
  copyrightText,
  termsText = 'Terms',
  privacyText = 'Privacy',
  docsText = 'Docs',
  termsUrl = '#',
  privacyUrl = '#',
  docsUrl = '#',
}: FooterProps) {
  const displayCopyright = copyrightText || `© ${copyrightYear} ${brandName}`;

  return (
    <footer className="border-t border-white/[0.04] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-foreground flex items-center justify-center">
              <Layers className="w-2.5 h-2.5 text-background" />
            </div>
            <span className="font-medium text-xs text-muted-foreground">{brandName}</span>
          </Link>

          <div className="flex items-center gap-6 text-xs text-muted-foreground/60">
            <a href={termsUrl} className="hover:text-foreground transition-colors">{termsText}</a>
            <a href={privacyUrl} className="hover:text-foreground transition-colors">{privacyText}</a>
            <a href={docsUrl} className="hover:text-foreground transition-colors">{docsText}</a>
          </div>

          <div className="text-xs text-muted-foreground/40">
            {displayCopyright}
          </div>
        </div>
      </div>
    </footer>
  );
}

const FooterPropsSchema = z.object({
  brandName: z.string().optional().describe('The brand/company name displayed in the footer'),
  copyrightYear: z.string().optional().describe('The copyright year (e.g., "2024")'),
  copyrightText: z.string().optional().describe('Full copyright text (e.g., "© 2024 Spatial"). If not provided, it will be generated from copyrightYear and brandName'),
  termsText: z.string().optional().describe('Text for the Terms link'),
  privacyText: z.string().optional().describe('Text for the Privacy link'),
  docsText: z.string().optional().describe('Text for the Docs link'),
  termsUrl: z.string().optional().describe('URL for the Terms link'),
  privacyUrl: z.string().optional().describe('URL for the Privacy link'),
  docsUrl: z.string().optional().describe('URL for the Docs link'),
});

export const Footer = withInteractable(FooterBase, {
  componentName: 'Footer',
  description: 'Footer component with brand name, navigation links (Terms, Privacy, Docs), and copyright information. All text and URLs are editable.',
  propsSchema: FooterPropsSchema,
});
