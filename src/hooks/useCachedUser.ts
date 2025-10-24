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
        setCached(JSON.parse(raw));
      } catch {
        setCached(null);
      }
    }
  }, []);

  return cached;
}