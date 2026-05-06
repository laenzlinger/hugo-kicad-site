/**
 * Detect if the current theme is dark mode.
 * Works with PaperMod (data-theme on html) and Hextra (.dark class on html).
 */
export function isDarkMode() {
  return document.documentElement.dataset.theme === 'dark' ||
    document.documentElement.classList.contains('dark');
}
