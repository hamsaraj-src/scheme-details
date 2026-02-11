import React, { createContext, useContext, useState } from 'react';

interface ReturnAnalysisState {
  activeTab: 'ptp' | 'sip';
  setActiveTab: (tab: 'ptp' | 'sip') => void;
}

const ReturnAnalysisContext = createContext<ReturnAnalysisState | undefined>(undefined);

export const ReturnAnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'ptp' | 'sip'>('ptp');

  return (
    <ReturnAnalysisContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ReturnAnalysisContext.Provider>
  );
};

export const useReturnAnalysisContext = (): ReturnAnalysisState => {
  const context = useContext(ReturnAnalysisContext);
  if (context === undefined) {
    throw new Error('useReturnAnalysisContext must be used within a ReturnAnalysisProvider');
  }
  return context;
};
