import React, { createContext, useCallback, useContext, useState } from 'react';
import { UpgradeModal } from '@/presentation/components/shared/UpgradeModal';

interface UpgradeModalContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const UpgradeModalContext = createContext<UpgradeModalContextValue | null>(null);

/**
 * App-wide provider so any "Upgrade" button — TopNav dropdown, widget
 * gallery, Studio sidebar, Settings — opens the same modal instance.
 * Put this inside AuthProvider so the modal can react to auth state if needed.
 */
export const UpgradeModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <UpgradeModalContext.Provider value={{ open, close, isOpen }}>
      {children}
      <UpgradeModal open={isOpen} onClose={close} />
    </UpgradeModalContext.Provider>
  );
};

export const useUpgradeModal = (): UpgradeModalContextValue => {
  const ctx = useContext(UpgradeModalContext);
  if (!ctx) throw new Error('useUpgradeModal must be used within UpgradeModalProvider');
  return ctx;
};
