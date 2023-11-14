import React, { useContext, useEffect, useState } from "react";
import { IndexContext } from "../../StateContexts/IndexContext";
import { PlaylistContext } from "../../StateContexts/PlaylistContext";
import { SortedSongsContext } from "../../StateContexts/SortedSongsContext";


// TODO Global Media Controls refresh every time the howl changes
// TODO Look into populating the media metadata in the TableContent component since that's where the most up-to-date data is.

interface GlobalMediaProps {
  currentHowl: Howl;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  songTitles: string[];
  setActiveSong: (activeSong: string) => void;
}

const GlobalMediaController: React.FC<GlobalMediaProps> = ({
  currentHowl,
  setIsPlaying,
  songTitles,
  setActiveSong,
}) => {
  //Context States
  const { currentSongIndex, setCurrentSongIndex } = useContext(IndexContext);
  const { sortedSongs, setSortedSongs } = useContext(SortedSongsContext);
  const { currentPlaylistId } = useContext(PlaylistContext);


  // Function to handle next/previous song
  const handleSongChange = (delta: number) => {
    if (songTitles.length === 1) currentHowl.seek(0);
    const nextSongIndex = currentSongIndex + delta;

    // If at the end of the array, reset to the beginning
    if (nextSongIndex >= songTitles.length) {
      setCurrentSongIndex(0);
      setActiveSong(songTitles[0]);
    } else if (nextSongIndex < 0) {
      // If at the beginning, go to the end
      setCurrentSongIndex(songTitles.length - 1);
      setActiveSong(songTitles[songTitles.length - 1]);
      // Otherwise, handle the change normally
    } else {
      setCurrentSongIndex(nextSongIndex);
      setActiveSong(songTitles[nextSongIndex]);
    }
  };

  //--------------------GLOBAL MEDIA CONTROLS----------------------------
  useEffect(() => {
    console.log("****Media Controls reset");
    
    if (currentHowl) {
      // Define media metadata
      const mediaMetadata = new MediaMetadata({
        //TODO play songs like this in the MusicController
        title: `${sortedSongs[currentSongIndex].title}`,
        artist: `${sortedSongs[currentSongIndex].artist}`,
        album: `${sortedSongs[currentSongIndex].album}`,
        artwork: [
          {
            src: `data:image/jpeg;base64,${sortedSongs[currentSongIndex].image[0].imageBuffer}`,
            sizes: "96x96",
            type: `${sortedSongs[currentSongIndex].image[0].mime}`,
          },
          {
            src: `data:image/jpeg;base64,${sortedSongs[currentSongIndex].image[0].imageBuffer}`,
            sizes: "128x128",
            type: `${sortedSongs[currentSongIndex].image[0].mime}`,
          },
          {
            src: `data:image/jpeg;base64,${sortedSongs[currentSongIndex].image[0].imageBuffer}`,
            sizes: "192x192",
            type: `${sortedSongs[currentSongIndex].image[0].mime}`,
          },
          {
            src: `data:image/jpeg;base64,${sortedSongs[currentSongIndex].image[0].imageBuffer}`,
            sizes: "256x256",
            type: `${sortedSongs[currentSongIndex].image[0].mime}`,
          },
          {
            src: `data:image/jpeg;base64,${sortedSongs[currentSongIndex].image[0].imageBuffer}`,
            sizes: "384x384",
            type: `${sortedSongs[currentSongIndex].image[0].mime}`,
          },
          {
            src: `data:image/jpeg;base64,${sortedSongs[currentSongIndex].image[0].imageBuffer}`,
            sizes: "512x512",
            type: `${sortedSongs[currentSongIndex].image[0].mime}`,
          },
        ],
      });

      navigator.mediaSession.metadata = mediaMetadata;
      console.log("MEDIA SESSION: ", navigator.mediaSession.metadata);

      // Clean up by removing the event listener when the component unmounts
      return () => {};
    }
  }, [currentHowl, sortedSongs]);

  //---------------------------------------------------------------------
  navigator.mediaSession.setActionHandler("play", function () {
    navigator.mediaSession.playbackState = "playing";
    setActiveSong(songTitles[currentSongIndex]);
    setIsPlaying(true);
  });

  navigator.mediaSession.setActionHandler("pause", function () {
    navigator.mediaSession.playbackState = "paused";
    setIsPlaying(false);
    currentHowl.pause();
  });

  navigator.mediaSession.setActionHandler("nexttrack", function () {
    handleSongChange(1);
  });
  
  navigator.mediaSession.setActionHandler("previoustrack", function () {
    handleSongChange(-1);
  });

  //prettier-ignore
  return (
      <div className="GlobalMediaController">
      </div>
  );
};
export default GlobalMediaController;
