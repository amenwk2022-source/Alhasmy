/**
 * Safe clipboard helper utility with fallback for iframes and restricted environments.
 */

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    // Fallback to execCommand for older / sandboxed iframe environments
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.warn('Clipboard writeText failed:', err);
    return false;
  }
}

export async function copyImageBlobToClipboard(blob: Blob): Promise<boolean> {
  try {
    if (navigator.clipboard && (window as any).ClipboardItem && navigator.clipboard.write) {
      const item = new (window as any).ClipboardItem({ [blob.type || 'image/png']: blob });
      await navigator.clipboard.write([item]);
      return true;
    }
  } catch (err) {
    console.warn('Image clipboard write failed or permission denied:', err);
  }
  return false;
}
