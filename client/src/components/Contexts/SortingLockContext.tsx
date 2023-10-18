import React, { createContext, useContext, useState } from "react";

export const SortingLockContext = createContext<{
  sortingLock: string;
  setSortingLock: (file: string) => void;
}>({
    sortingLock: "unsorted",
    setSortingLock: () => {},
});

export const useSortingLockContext = () => useContext(SortingLockContext);

// prettier-ignore
export const SortingLockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sortingLock, setSortingLock] = useState<string>("unsorted");

  return (
    <SortingLockContext.Provider value={{ sortingLock, setSortingLock }}>
      {children}
    </SortingLockContext.Provider>
  );
};

export const useSortingLock = () => useContext(SortingLockContext);
