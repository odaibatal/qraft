import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('LanguageContext', () => {
  it('defaults to English', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.language).toBe('en');
    expect(result.current.dir).toBe('ltr');
    expect(result.current.t('Studio')).toBe('Studio');
  });

  it('toggles language to Arabic', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    act(() => {
      result.current.toggleLanguage();
    });
    expect(result.current.language).toBe('ar');
    expect(result.current.dir).toBe('rtl');
    expect(result.current.t('Studio')).toBe('الاستوديو');
  });

  it('falls back to key when translation missing', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.t('NonExistentKey')).toBe('NonExistentKey');
  });
});
