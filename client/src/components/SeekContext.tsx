import React, { createContext, useContext, useState } from "react";

export const SeekContext = createContext<{
  isSeeking: boolean | null;
  setIsSeeking: (file: boolean | null) => void;
}>({
  isSeeking: null,
  setIsSeeking: () => {},
});

export const useSeekContext = () => useContext(SeekContext);

// prettier-ignore
export const SeekProvider: React.FC<{ children: React.ReactNode }> = ({children,}) => {
  const [isSeeking, setIsSeeking] = useState<boolean | null>(null);

  return (
    <SeekContext.Provider value={{ isSeeking, setIsSeeking }}>
      {children}
    </SeekContext.Provider>
  );
};

export const usePlayer = () => useContext(SeekContext);
