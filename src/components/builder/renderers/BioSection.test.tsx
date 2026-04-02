import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BioSectionRenderer } from './index';
import type { CanvasElement } from '@/contexts/BuilderContext';

// Mock the useBuilder hook
vi.mock('@/contexts/BuilderContext', () => ({
  useBuilder: () => ({
    activeTheme: {
      background: '#ffffff',
      foreground: '#1a1a1a',
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#3b82f6',
    },
  }),
}));

// Helper to render component
const renderComponent = (element: CanvasElement) => {
  return render(<BioSectionRenderer element={element} />);
};

describe('BioSectionRenderer', () => {
  it('renders with default props', () => {
    const element: CanvasElement = {
      id: 'bio-1',
      type: 'BioSection',
      label: 'Bio Section',
      props: {
        heading: 'About Me',
        content: 'This is my bio.',
        profileImageUrl: '',
        imagePosition: 'left',
        imageSize: 'medium',
      },
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
    };

    renderComponent(element);
    
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('This is my bio.')).toBeInTheDocument();
  });

  it('renders with profile image on the left', () => {
    const element: CanvasElement = {
      id: 'bio-2',
      type: 'BioSection',
      label: 'Bio Section',
      props: {
        heading: 'About Dr. Smith',
        content: 'Professor of Computer Science.',
        profileImageUrl: 'https://example.com/profile.jpg',
        imagePosition: 'left',
        imageSize: 'medium',
      },
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
    };

    renderComponent(element);
    
    expect(screen.getByText('About Dr. Smith')).toBeInTheDocument();
    expect(screen.getByAltText('Profile')).toBeInTheDocument();
    expect(screen.getByAltText('Profile')).toHaveAttribute('src', 'https://example.com/profile.jpg');
  });

  it('renders with profile image on the right', () => {
    const element: CanvasElement = {
      id: 'bio-3',
      type: 'BioSection',
      label: 'Bio Section',
      props: {
        heading: 'Biography',
        content: 'My research focuses on AI.',
        profileImageUrl: 'https://example.com/photo.jpg',
        imagePosition: 'right',
        imageSize: 'large',
      },
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
    };

    renderComponent(element);
    
    expect(screen.getByText('Biography')).toBeInTheDocument();
    expect(screen.getByAltText('Profile')).toBeInTheDocument();
  });

  it('renders with centered image', () => {
    const element: CanvasElement = {
      id: 'bio-4',
      type: 'BioSection',
      label: 'Bio Section',
      props: {
        heading: 'Welcome',
        content: 'I am a researcher.',
        profileImageUrl: 'https://example.com/image.jpg',
        imagePosition: 'center',
        imageSize: 'small',
      },
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
    };

    renderComponent(element);
    
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByAltText('Profile')).toBeInTheDocument();
  });

  it('does not render image when imagePosition is none', () => {
    const element: CanvasElement = {
      id: 'bio-5',
      type: 'BioSection',
      label: 'Bio Section',
      props: {
        heading: 'About',
        content: 'Text only bio.',
        profileImageUrl: 'https://example.com/image.jpg',
        imagePosition: 'none',
        imageSize: 'medium',
      },
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
    };

    renderComponent(element);
    
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
  });

  it('does not render image when profileImageUrl is empty', () => {
    const element: CanvasElement = {
      id: 'bio-6',
      type: 'BioSection',
      label: 'Bio Section',
      props: {
        heading: 'My Story',
        content: 'No image provided.',
        profileImageUrl: '',
        imagePosition: 'left',
        imageSize: 'medium',
      },
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
    };

    renderComponent(element);
    
    expect(screen.getByText('My Story')).toBeInTheDocument();
    expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
  });

  it('handles multi-paragraph content with line breaks', () => {
    const element: CanvasElement = {
      id: 'bio-7',
      type: 'BioSection',
      label: 'Bio Section',
      props: {
        heading: 'Biography',
        content: 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.',
        profileImageUrl: '',
        imagePosition: 'none',
        imageSize: 'medium',
      },
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
    };

    renderComponent(element);
    
    const contentElement = screen.getByText(/First paragraph/);
    expect(contentElement).toBeInTheDocument();
    expect(contentElement.textContent).toContain('Second paragraph');
    expect(contentElement.textContent).toContain('Third paragraph');
  });
});
