import React, { createContext, useContext, useState } from "react";

export const PlayerContext = createContext<{
  //TODO USE STRING[]
  //Consider duration of a song
  //Or store it in the local storage, will MOST likely need persistence
  activeSong: string | string[] | null;
  setActiveSong: (file: string | null) => void;
}>({
  activeSong: null,
  setActiveSong: () => {},
});

export const usePlayerContext = () => useContext(PlayerContext);

// prettier-ignore
export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({children,}) => {
  const [activeSong, setActiveSong] = useState<string | null>(null);

  return (
    <PlayerContext.Provider value={{ activeSong, setActiveSong }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
