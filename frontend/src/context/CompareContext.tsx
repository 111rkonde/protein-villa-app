import React, { createContext, useContext, useState } from 'react';
import { Product } from '../types';
import { useToast } from './ToastContext';

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  isCompareDrawerOpen: boolean;
  setIsCompareDrawerOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState<boolean>(false);
  const { showToast } = useToast();

  const addToCompare = (product: Product) => {
    if (compareList.some((p) => p.id === product.id)) {
      showToast(`${product.name} is already in the comparison list.`, 'info');
      return;
    }

    if (compareList.length >= 3) {
      showToast('You can compare a maximum of 3 products at a time.', 'warning');
      return;
    }

    setCompareList((prev) => [...prev, product]);
    showToast(`Added ${product.name} to comparison! ⚖️`, 'success');
    setIsCompareDrawerOpen(true);
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (productId: string) => {
    return compareList.some((p) => p.id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isCompareDrawerOpen,
        setIsCompareDrawerOpen,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
