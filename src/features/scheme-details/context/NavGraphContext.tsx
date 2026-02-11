import React, { createContext, useContext, useState, useCallback } from 'react';

interface NavGraphState {
  selectedPeriod: string;
  touchX: number | null;
  setSelectedPeriod: (period: string) => void;
  setTouchX: (x: number | null) => void;
  handlePeriodSelect: (key: string) => void;
}

const NavGraphContext = createContext<NavGraphState | undefined>(undefined);

export const NavGraphProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('MAX');
  const [touchX, setTouchX] = useState<number | null>(null);

  const handlePeriodSelect = useCallback((key: string) => {
    setSelectedPeriod(key);
    setTouchX(null);
  }, []);

  return (
    <NavGraphContext.Provider
      value={{ selectedPeriod, touchX, setSelectedPeriod, setTouchX, handlePeriodSelect }}
    >
      {children}
    </NavGraphContext.Provider>
  );
};

export const useNavGraphContext = (): NavGraphState => {
  const context = useContext(NavGraphContext);
  if (context === undefined) {
    throw new Error('useNavGraphContext must be used within a NavGraphProvider');
  }
  return context;
};
