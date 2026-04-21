import { useSyncExternalStore } from 'react';

/**
 * Dev-panel visibility toggle.
 *
 * Both BranchSwitcher and ClaudeFeedback's DevPanel watch this state
 * so a single master toggle (rendered by DevPanelsToggle) can hide /
 * show them together. Persists across reloads via localStorage.
 */

const KEY = 'peachy_dev_panels_hidden';
const listeners = new Set<() => void>();

function read(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): boolean {
  return read();
}

function getServerSnapshot(): boolean {
  return false;
}

export function useDevPanelsHidden(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function toggleDevPanelsHidden(): void {
  const next = !read();
  try {
    if (next) window.localStorage.setItem(KEY, '1');
    else window.localStorage.removeItem(KEY);
  } catch {
    // ignore — storage unavailable
  }
  listeners.forEach((fn) => fn());
}
