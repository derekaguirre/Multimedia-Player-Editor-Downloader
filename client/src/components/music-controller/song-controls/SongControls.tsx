import React, { useContext, useEffect, useState } from "react";
import NextIcon from "../../../images/next.svg";
import PauseIcon from "../../../images/pause.svg";
import PrevIcon from "../../../images/prev.svg";
import { IndexContext } from "../../IndexContext";
import PlayIcon from "./../../../images/play.svg";
import "./SongControls.scss";

// TODO persist active song name and current time in song using local storage to continue listening session

interface SongControlProps {
  currentHowl: Howl;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  songTitles: string[];
  setActiveSong: (activeSong: string) => void;
}

const SongControls: React.FC<SongControlProps> = ({ currentHowl, isPlaying, setIsPlaying, songTitles, setActiveSong }) => {
  //Context States
  const { currentSongIndex, setCurrentSongIndex } = useContext(IndexContext);

  //Toggles between play and pause
  const togglePlayPause = () => {
    if (currentHowl) {
      if (isPlaying) {
        setIsPlaying(false);
        currentHowl.pause();
      } else {
        setActiveSong(songTitles[currentSongIndex]);
        setIsPlaying(true);
      }
    }
  };

  // Function to handle next/previous song
  const handleSongChange = (delta: number) => {
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

  //prettier-ignore
  return (
      <div className="songButtonElements">
        <div className="PrevButton" onClick={()=> handleSongChange(-1)}>
          <img src={PrevIcon} width={30} height={30} />
        </div>
        <div onClick={() => togglePlayPause()} className="PlayButton">
          {isPlaying ? (<img src={PauseIcon} width={30} height={30} />) : (<img src={PlayIcon} width={30} height={30} />)}
        </div>
        <div className="NextButton" onClick={()=> handleSongChange(1)}>
          <img src={NextIcon} width={30} height={30} />
        </div>
      </div>
  );
};
export default SongControls;
