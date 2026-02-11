import { useMemo } from 'react';
import { schemeData, SchemeData } from '../data/schemeData';

export const useSchemeData = (): SchemeData | null => {
  const scheme = useMemo(() => {
    try {
      const result = schemeData?.result?.[0]?.mf_schemes?.[0];
      return result || null;
    } catch {
      return null;
    }
  }, []);

  return scheme;
};
