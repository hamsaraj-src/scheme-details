import React, { createContext, useContext, useState } from 'react';

interface ReturnCalculatorState {
  activeToggle: string;
  setActiveToggle: (toggle: string) => void;
  amount: number;
  setAmount: (amount: number) => void;
  selectedDurationKey: string;
  setSelectedDurationKey: (key: string) => void;
}

const ReturnCalculatorContext = createContext<ReturnCalculatorState | undefined>(undefined);

export const ReturnCalculatorProvider: React.FC<{
  children: React.ReactNode;
  minInvestment: number;
}> = ({ children, minInvestment }) => {
  const [activeToggle, setActiveToggle] = useState('sip');
  const [amount, setAmount] = useState(minInvestment);
  const [selectedDurationKey, setSelectedDurationKey] = useState('1M');

  return (
    <ReturnCalculatorContext.Provider
      value={{
        activeToggle,
        setActiveToggle,
        amount,
        setAmount,
        selectedDurationKey,
        setSelectedDurationKey,
      }}
    >
      {children}
    </ReturnCalculatorContext.Provider>
  );
};

export const useReturnCalculatorContext = (): ReturnCalculatorState => {
  const context = useContext(ReturnCalculatorContext);
  if (context === undefined) {
    throw new Error('useReturnCalculatorContext must be used within a ReturnCalculatorProvider');
  }
  return context;
};
