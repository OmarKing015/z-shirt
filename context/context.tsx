
"use client"
import { createContext, useContext, useState } from 'react';

const Context = createContext<any>(null);

export const ContextProvider = ({ children } : {children: React.ReactNode}) => {
  const [test, setTest] = useState(false);
  const [assetId, setAssetId] = useState<string | null>(null);


  return (
    <Context.Provider value={{ test, setTest, assetId, setAssetId }}>
      {children}
    </Context.Provider>
  );
};

export const useAppContext = () => useContext(Context);
