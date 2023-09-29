import React, { createContext, useContext, useState } from "react";

export const IndexContext = createContext<{
  currentSongIndex: number;
  setCurrentSongIndex: (index: number) => void;
}>({
  currentSongIndex: 0,
  setCurrentSongIndex: () => {},
});

export const useIndexContext = () => useContext(IndexContext);


// prettier-ignore
export const IndexProvider: React.FC<{ children: React.ReactNode }> = ({children,}) => {
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);

  return (
    <IndexContext.Provider value={{ currentSongIndex, setCurrentSongIndex }}>
      {children}
    </IndexContext.Provider>
  );
};

export const useIndex = () => useContext(IndexContext);

