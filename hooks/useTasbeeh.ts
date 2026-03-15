import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'asmaul_husna_tasbeeh';

export function useTasbeeh() {
  const [counts, setCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) setCounts(JSON.parse(val));
    });
  }, []);

  const increment = useCallback((id: number) => {
    setCounts((prev) => {
      const current = prev[id] || 0;
      const next = current >= 99 ? 0 : current + 1;
      const updated = { ...prev, [id]: next };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const reset = useCallback((id: number) => {
    setCounts((prev) => {
      const updated = { ...prev, [id]: 0 };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { counts, increment, reset };
}
