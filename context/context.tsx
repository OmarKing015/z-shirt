"use client";

import { createContext, useContext, useState } from 'react';

const Context = createContext<any>(null);

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [assetId, setAssetId] = useState<string | null>(null);
  const [extraCost, setExtraCost] = useState(0);

  return (
    <Context.Provider value={{ assetId, setAssetId, extraCost, setExtraCost }}>
      {children}
    </Context.Provider>
  );
};

export const useAppContext = () => useContext(Context);
