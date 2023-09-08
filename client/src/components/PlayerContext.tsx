import React, { createContext, useContext, useState } from "react";

interface PlayerContextType {
  playingFile: string | null;
  setPlayingFile: (file: string | null) => void;
  //Can also share the duration or store it in the local storage, need persistence
}

const initialPlayerContext: PlayerContextType = {
  playingFile: null,
  setPlayingFile: () => {},
};

const PlayerContext = createContext<PlayerContextType>(initialPlayerContext);

export const usePlayerContext = () => useContext(PlayerContext);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({children,}) => {
  const [playingFile, setPlayingFile] = useState<string | null>(
    initialPlayerContext.playingFile
  );

  return (
    <PlayerContext.Provider value={{ playingFile, setPlayingFile }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
