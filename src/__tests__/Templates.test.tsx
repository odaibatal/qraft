import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider } from '../contexts/LanguageContext';
import Templates from '../components/templates/Templates';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('Templates', () => {
  it('renders template cards', () => {
    render(<Templates onSelectTemplate={() => {}} />, { wrapper });
    expect(screen.getByText('Wi-Fi — Café')).toBeInTheDocument();
    expect(screen.getByText('Instagram Profile')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Event')).toBeInTheDocument();
  });

  it('calls onSelectTemplate when a card is clicked', () => {
    const onSelectTemplate = vi.fn();
    render(<Templates onSelectTemplate={onSelectTemplate} />, { wrapper });
    fireEvent.click(screen.getByText('Instagram Profile'));
    expect(onSelectTemplate).toHaveBeenCalledTimes(1);
    expect(onSelectTemplate).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'url',
        url: 'https://instagram.com/qraft.studio',
      })
    );
  });
});
