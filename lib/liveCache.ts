'use client';

const PREFIX = 'au_shop_live_';

export function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    return parsed?.data ?? null;
  } catch {
    return null;
  }
}

export function setCached<T>(key: string, data: T) {
  try {
    localStorage.setItem(
      PREFIX + key,
      JSON.stringify({
        data,
        updatedAt: Date.now(),
      })
    );
  } catch {
    // Ignore localStorage errors.
  }
}
