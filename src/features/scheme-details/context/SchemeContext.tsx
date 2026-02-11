import React, { createContext, useContext, useMemo } from 'react';
import { schemeData, SchemeData } from '../../../data/schemeData';

interface SchemeContextValue {
  scheme: SchemeData | null;
  isLoading: boolean;
}

const SchemeContext = createContext<SchemeContextValue>({
  scheme: null,
  isLoading: true,
});

export const SchemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useMemo<SchemeContextValue>(() => {
    try {
      const result = schemeData?.result?.[0]?.mf_schemes?.[0];
      return { scheme: result || null, isLoading: false };
    } catch {
      return { scheme: null, isLoading: false };
    }
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
