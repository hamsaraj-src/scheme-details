import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const ANIM_DURATION = 700;

interface SectorAllocationState {
  activeTab: 'asset' | 'sector';
  setActiveTab: (tab: 'asset' | 'sector') => void;
  progress: number;
}

const SectorAllocationContext = createContext<SectorAllocationState | undefined>(undefined);

export const SectorAllocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'asset' | 'sector'>('sector');
  const [progress, setProgress] = useState(0);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setProgress(0);
    startRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startRef.current;
      const t = Math.min(elapsed / ANIM_DURATION, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [activeTab]);

  return (
    <SectorAllocationContext.Provider value={{ activeTab, setActiveTab, progress }}>
      {children}
    </SectorAllocationContext.Provider>
  );
};

export const useSectorAllocationContext = (): SectorAllocationState => {
  const context = useContext(SectorAllocationContext);
  if (context === undefined) {
    throw new Error('useSectorAllocationContext must be used within a SectorAllocationProvider');
  }
  return context;
};
