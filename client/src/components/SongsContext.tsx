import React, { createContext, useContext, useState } from "react";

// Create a context and provider for songs

// interface ImageTypeObject {
//   imageId: number;
//   imageName: string;
//   _id: string;
// }
// export interface ImageObject {
//   image: {
//     mime: string;
//     imageType: ImageTypeObject;
//     imageDescription: string;
//     imageBuffer: Buffer;
//     _id: string;
//   }[];
// }

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
    }[];
    imageDescription: string;
    imageBuffer: number[];
    _id: string;
  }[];
  _id: string;
  [key: string]: any;
}

export const SongsContext = createContext<{
  songs: SongObject[];
  setSongs: React.Dispatch<React.SetStateAction<SongObject[]>>;
}>({
  songs: [],
  setSongs: () => {}, // Provide a default setter function
});

// Create a SongsProvider component
export const SongsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [songs, setSongs] = useState<SongObject[]>([]);

  return (
    <SongsContext.Provider value={{ songs, setSongs }}>
      {children}
    </SongsContext.Provider>
  );
};

export const useSongs = () => useContext(SongsContext);
