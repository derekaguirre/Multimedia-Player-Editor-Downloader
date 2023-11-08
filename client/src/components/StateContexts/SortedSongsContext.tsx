import React, { createContext, useContext, useState } from "react";
import { SongObject } from "./SongsContext";
// Create a context and provider for sorted songs


export const SortedSongsContext = createContext<{
  sortedSongs: SongObject[];
  setSortedSongs: React.Dispatch<React.SetStateAction<SongObject[]>>;
}>({
  sortedSongs: [],
  setSortedSongs: () => {}, // Provide a default setter function
});

// Create a SortedSongsProvider component
export const SortedSongsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sortedSongs, setSortedSongs] = useState<SongObject[]>([]);

  return (
    <SortedSongsContext.Provider value={{ sortedSongs, setSortedSongs }}>
      {children}
    </SortedSongsContext.Provider>
  );
};

export const useSongs = () => useContext(SortedSongsContext);
