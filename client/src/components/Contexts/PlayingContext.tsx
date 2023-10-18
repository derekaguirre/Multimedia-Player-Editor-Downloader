import React, { createContext, useContext, useState } from "react";

export const PlayingContext = createContext<{
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}>({
  isPlaying: false,
  setIsPlaying: () => {},
});

export const usePlayingContext = () => useContext(PlayingContext);

// prettier-ignore
export const PlayingProvider: React.FC<{ children: React.ReactNode }> = ({children,}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <PlayingContext.Provider value={{ isPlaying, setIsPlaying }}>
      {children}
    </PlayingContext.Provider>
  );
};

export const usePlaying = () => useContext(PlayingContext);

