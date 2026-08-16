import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQrSettings } from '../hooks/useQrSettings';

describe('useQrSettings', () => {
  it('returns default settings', () => {
    const { result } = renderHook(() => useQrSettings());
    expect(result.current.settings.type).toBe('url');
    expect(result.current.settings.fgColor).toBe('#0E1420');
    expect(result.current.settings.bgColor).toBe('#FFFFFF');
    expect(result.current.settings.size).toBe(280);
    expect(result.current.settings.errorLevel).toBe('M');
  });

  it('updates a setting', () => {
    const { result } = renderHook(() => useQrSettings());
    act(() => {
      result.current.update('url', 'https://example.com');
    });
    expect(result.current.settings.url).toBe('https://example.com');
  });

  it('generates correct value for wifi', () => {
    const { result } = renderHook(() => useQrSettings());
    act(() => {
      result.current.update('type', 'wifi');
      result.current.update('ssid', 'MyWifi');
      result.current.update('wifiPassword', 'secret');
      result.current.update('wifiEncryption', 'WPA');
    });
    expect(result.current.getValue(result.current.settings)).toBe('WIFI:T:WPA;S:MyWifi;P:secret;;');
  });

  it('generates correct value for vcard', () => {
    const { result } = renderHook(() => useQrSettings());
    act(() => {
      result.current.update('type', 'vcard');
      result.current.update('name', 'John Doe');
      result.current.update('phone', '+123456789');
      result.current.update('email', 'john@example.com');
    });
    const val = result.current.getValue(result.current.settings);
    expect(val).toContain('FN:John Doe');
    expect(val).toContain('TEL:+123456789');
    expect(val).toContain('EMAIL:john@example.com');
  });

  it('applies a template', () => {
    const { result } = renderHook(() => useQrSettings());
    act(() => {
      result.current.applyTemplate({ type: 'wifi', ssid: 'CafeWifi' });
    });
    expect(result.current.settings.type).toBe('wifi');
    expect(result.current.settings.ssid).toBe('CafeWifi');
  });
});
