/**
 * Shows a "not implemented" modal for demo stub features.
 */
export function showNotImplemented() {
  const modal = document.getElementById('not-implemented-modal');
  if (modal) {
    modal.style.display = 'flex';

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    }, { once: true });
  }
}

/**
 * Helper: returns an onclick handler string for inline HTML use.
 */
export function notImplementedAttr() {
  return `onclick="document.getElementById('not-implemented-modal').style.display='flex'"`;
}
