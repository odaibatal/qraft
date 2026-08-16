import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageProvider } from '../contexts/LanguageContext';
import Studio from '../components/studio/Studio';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('Studio', () => {
  it('renders the controls section', () => {
    render(<Studio />, { wrapper });
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(4);
    expect(tabs.map(t => t.textContent)).toEqual(['URL', 'Wi-Fi', 'vCard', 'Text']);
    expect(screen.getByText('Download PNG')).toBeInTheDocument();
    expect(screen.getByText('Download SVG')).toBeInTheDocument();
  });

  it('renders the preview section', () => {
    render(<Studio />, { wrapper });
    expect(screen.getByText('Live Preview')).toBeInTheDocument();
    expect(screen.getByText(/280×280px/)).toBeInTheDocument();
  });

  it('switches type tabs and updates dynamic inputs', async () => {
    render(<Studio />, { wrapper });
    fireEvent.click(screen.getByRole('tab', { name: /Wi-Fi/ }));
    await waitFor(() => {
      expect(screen.getByPlaceholderText('My Network')).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });
});
