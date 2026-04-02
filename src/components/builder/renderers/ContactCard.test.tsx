import { describe, it, expect, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import fc from 'fast-check';
import { ContactCardRenderer } from './index';
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
  return render(<ContactCardRenderer element={element} />);
};

describe('ContactCardRenderer', () => {
  it('renders with all contact fields provided', () => {
    const element: CanvasElement = {
      id: 'test-contact-1',
      type: 'ContactCard',
      label: 'Contact Card',
      props: {
        email: 'professor@university.edu',
        officeLocation: 'Room 301, Science Building',
        phoneNumber: '+1-555-0123',
        officeHours: 'Monday 2-4pm\nWednesday 10am-12pm',
        showIcons: true,
      },
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
    };

    renderComponent(element);

    // Check that all fields are rendered
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('professor@university.edu')).toBeInTheDocument();
    expect(screen.getByText('Room 301, Science Building')).toBeInTheDocument();
    expect(screen.getByText('+1-555-0123')).toBeInTheDocument();
    expect(screen.getByText(/Monday 2-4pm/)).toBeInTheDocument();
  });

  it('renders only provided contact fields', () => {
    const element: CanvasElement = {
      id: 'test-contact-2',
      type: 'ContactCard',
      label: 'Contact Card',
      props: {
        email: 'professor@university.edu',
        officeLocation: '',
        phoneNumber: '',
        officeHours: '',
        showIcons: true,
      },
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
    };

    renderComponent(element);

    // Only email should be rendered
    expect(screen.getByText('professor@university.edu')).toBeInTheDocument();
    expect(screen.queryByText('Office')).not.toBeInTheDocument();
    expect(screen.queryByText('Phone')).not.toBeInTheDocument();
    expect(screen.queryByText('Office Hours')).not.toBeInTheDocument();
  });

  it('renders placeholder when no contact information provided', () => {
    const element: CanvasElement = {
      id: 'test-contact-3',
      type: 'ContactCard',
      label: 'Contact Card',
      props: {
        email: '',
        officeLocation: '',
        phoneNumber: '',
        officeHours: '',
        showIcons: true,
      },
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
    };

    renderComponent(element);

    expect(screen.getByText('Add contact information to display')).toBeInTheDocument();
  });

  it('renders without icons when showIcons is false', () => {
    const element: CanvasElement = {
      id: 'test-contact-4',
      type: 'ContactCard',
      label: 'Contact Card',
      props: {
        email: 'professor@university.edu',
        officeLocation: 'Room 301',
        phoneNumber: '',
        officeHours: '',
        showIcons: false,
      },
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
    };

    const { container } = renderComponent(element);

    // Check that email is rendered
    expect(screen.getByText('professor@university.edu')).toBeInTheDocument();
    
    // Icons should not be present - check for the specific icon container style
    const iconContainers = container.querySelectorAll('div[style*="width: 32px"][style*="height: 32px"]');
    expect(iconContainers.length).toBe(0);
  });

  it('creates mailto link for email', () => {
    const element: CanvasElement = {
      id: 'test-contact-5',
      type: 'ContactCard',
      label: 'Contact Card',
      props: {
        email: 'test@example.com',
        officeLocation: '',
        phoneNumber: '',
        officeHours: '',
        showIcons: true,
      },
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
    };

    renderComponent(element);

    const emailLink = screen.getByText('test@example.com');
    expect(emailLink.tagName).toBe('A');
    expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com');
  });

  it('creates tel link for phone number', () => {
    const element: CanvasElement = {
      id: 'test-contact-6',
      type: 'ContactCard',
      label: 'Contact Card',
      props: {
        email: '',
        officeLocation: '',
        phoneNumber: '+1-555-0123',
        officeHours: '',
        showIcons: true,
      },
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
    };

    renderComponent(element);

    const phoneLink = screen.getByText('+1-555-0123');
    expect(phoneLink.tagName).toBe('A');
    expect(phoneLink).toHaveAttribute('href', 'tel:+1-555-0123');
  });

  it('handles multiline office hours', () => {
    const element: CanvasElement = {
      id: 'test-contact-7',
      type: 'ContactCard',
      label: 'Contact Card',
      props: {
        email: '',
        officeLocation: '',
        phoneNumber: '',
        officeHours: 'Monday: 2-4pm\nTuesday: 10am-12pm\nFriday: 1-3pm',
        showIcons: true,
      },
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
    };

    renderComponent(element);

    // Check that office hours text is present
    expect(screen.getByText(/Monday: 2-4pm/)).toBeInTheDocument();
  });

  it('Property 31: Contact card renders only provided fields', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.boolean(),
        fc.boolean(),
        fc.boolean(),
        fc.boolean(),
        (includeEmail, includeOffice, includePhone, includeHours, showIcons) => {
          cleanup();

          const email = includeEmail ? 'professor@university.edu' : '';
          const officeLocation = includeOffice ? 'Room 301, Science Building' : '';
          const phoneNumber = includePhone ? '+1-555-0123' : '';
          const officeHours = includeHours ? 'Monday 2-4pm' : '';

          const element: CanvasElement = {
            id: 'property-contact',
            type: 'ContactCard',
            label: 'Contact Card',
            props: {
              email,
              officeLocation,
              phoneNumber,
              officeHours,
              showIcons,
            },
            position: { x: 0, y: 0 },
            size: { width: 400, height: 300 },
          };

          const { unmount } = renderComponent(element);

          const noFields = !includeEmail && !includeOffice && !includePhone && !includeHours;
          if (noFields) {
            expect(screen.getByText('Add contact information to display')).toBeInTheDocument();
          } else {
            expect(screen.queryByText('Add contact information to display')).not.toBeInTheDocument();

            if (includeEmail) {
              expect(screen.getByText(email)).toBeInTheDocument();
            } else {
              expect(screen.queryByText('Email')).not.toBeInTheDocument();
            }

            if (includeOffice) {
              expect(screen.getByText(officeLocation)).toBeInTheDocument();
            } else {
              expect(screen.queryByText('Office')).not.toBeInTheDocument();
            }

            if (includePhone) {
              expect(screen.getByText(phoneNumber)).toBeInTheDocument();
            } else {
              expect(screen.queryByText('Phone')).not.toBeInTheDocument();
            }

            if (includeHours) {
              expect(screen.getByText(officeHours)).toBeInTheDocument();
            } else {
              expect(screen.queryByText('Office Hours')).not.toBeInTheDocument();
            }
          }

          unmount();
          cleanup();
        }
      ),
      { numRuns: 120 }
    );
  });
});
