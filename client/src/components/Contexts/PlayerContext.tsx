import React, { createContext, useContext, useState } from "react";

export const PlayerContext = createContext<{
  //TODO USE STRING[]
  //Consider duration of a song
  //Or store it in the local storage, will MOST likely need persistence
  activeSong: string | null;
  setActiveSong: (activeSong: string | null) => void;
  activeSongId: string;
  setActiveSongId: (activeSongId: string) => void;
}>({
  activeSong: null,
  setActiveSong: () => {},
  activeSongId: "",
  setActiveSongId: () => {},
});

export const usePlayerContext = () => useContext(PlayerContext);

// prettier-ignore
export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({children,}) => {
  const [activeSong, setActiveSong] = useState<string | null>(null);
  const [activeSongId, setActiveSongId] = useState<string>("");

  return (
    <PlayerContext.Provider value={{ activeSong, setActiveSong, activeSongId, setActiveSongId }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
