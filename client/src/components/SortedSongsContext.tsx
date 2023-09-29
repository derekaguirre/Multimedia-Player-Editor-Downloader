import React, { createContext, useContext, useState } from "react";

// Create a context and provider for sorted songs
export interface SongObject {
  fileNameOriginal: string;
  fileNameFormatted: string;
  fileSize: number;
  fileType: string;
  filePath: string;
  dateAdded: Date;
  isVisible: boolean;
  isLiked: boolean;
  title: string;
  duration: number;
  artist: string;
  album: string;
  genre: string;
  image: {
    mime: string;
    imageType: {
      imageId: number;
      imageName: string;
      _id: string;
    };
    imageDescription: string;
    imageBuffer: Buffer;
    _id: string;
  };
  _id: string;
  [key: string]: any;
}

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
