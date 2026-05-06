import { describe, it, expect, beforeEach } from 'vitest';
import { isDarkMode } from './theme-detect.js';

describe('isDarkMode', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark', 'light');
    document.body.classList.remove('dark');
  });

  it('detects dark mode via PaperMod data-theme attribute', () => {
    document.documentElement.dataset.theme = 'dark';
    expect(isDarkMode()).toBe(true);
  });

  it('detects light mode via PaperMod data-theme attribute', () => {
    document.documentElement.dataset.theme = 'light';
    expect(isDarkMode()).toBe(false);
  });

  it('detects dark mode via Hextra .dark class on html', () => {
    document.documentElement.classList.add('dark');
    expect(isDarkMode()).toBe(true);
  });

  it('detects light mode when no dark indicators present', () => {
    expect(isDarkMode()).toBe(false);
  });
});
