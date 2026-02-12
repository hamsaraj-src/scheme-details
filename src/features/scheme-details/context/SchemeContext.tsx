import React, { createContext, useContext, useState, useEffect } from 'react';
import { schemeData, SchemeData } from '../../../data/schemeData';

interface SchemeContextValue {
  scheme: SchemeData | null;
  isLoading: boolean;
}

const SchemeContext = createContext<SchemeContextValue>({
  scheme: null,
  isLoading: true,
});

const LOADING_DELAY_MS = 1500;

export const SchemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [value, setValue] = useState<SchemeContextValue>({
    scheme: null,
    isLoading: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const result = schemeData?.result?.[0]?.mf_schemes?.[0] as SchemeData | undefined;
        setValue({ scheme: result ?? null, isLoading: false });
      } catch {
        setValue({ scheme: null, isLoading: false });
      }
    }, LOADING_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SchemeContext.Provider value={value}>
      {children}
    </SchemeContext.Provider>
  );
};

export const useSchemeContext = (): SchemeContextValue => {
  const context = useContext(SchemeContext);
  if (context === undefined) {
    throw new Error('useSchemeContext must be used within a SchemeProvider');
  }
  return context;
};
