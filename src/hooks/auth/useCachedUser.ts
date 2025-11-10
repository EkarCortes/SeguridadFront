import { useState, useEffect } from 'react';

interface CachedUser {
  user: {
    id: number;
    username: string;
    rol: string;
    person_id: number;
    iat: number;
    exp: number;
  };
  accessToken: string;
  refreshToken: string;
}

export function useCachedUser() {
  const [cached, setCached] = useState<CachedUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('authMe');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setCached(parsed);
      } catch {
        setCached(null);
      }
    }
  }, []);

  const getCachedRefreshToken = (): string | null => {
    const raw = localStorage.getItem('authMe');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return parsed.refreshToken || null;
      } catch {
        return null;
      }
    }
    return null;
  };

  const clearCache = () => {
    localStorage.removeItem('authMe');
    setCached(null);
  };

  return {
    cached,
    getCachedRefreshToken,
    clearCache
  };
}