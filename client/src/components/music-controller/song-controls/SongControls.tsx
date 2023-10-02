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

const SongControls: React.FC<SongControlProps> = ({
  currentHowl,
  isPlaying,
  setIsPlaying,
  songTitles,
  setActiveSong,
}) => {
  //Context States
  const { currentSongIndex, setCurrentSongIndex } = useContext(IndexContext);

  //Toggles between play and pause
  const togglePlayPause = () => {
    if (currentHowl) {
      if (isPlaying) {
        setIsPlaying(false);
        currentHowl.pause();
      } else {
        currentHowl.play();
        setIsPlaying(true);
      }
    }
  };

  const handleNextSong = () => {
    const nextSongIndex = currentSongIndex + 1;
    console.log("Next song requested: ", songTitles[nextSongIndex]);
    //If at the end of the array, reset to the beginning of the array
    if (nextSongIndex >= songTitles.length) {
      setCurrentSongIndex(0);
      setActiveSong(songTitles[0]);
    } else {
      setCurrentSongIndex(nextSongIndex);
      setActiveSong(songTitles[nextSongIndex]);
    }
  };

  const handlePrevSong = () => {
    const nextSongIndex = currentSongIndex - 1;
    console.log("Next song requested: ", songTitles[nextSongIndex]);
    //If at the end of the array, reset to the beginning of the array
    if (nextSongIndex >= songTitles.length) {
      setCurrentSongIndex(0);
      setActiveSong(songTitles[0]);
    } else {
      setCurrentSongIndex(nextSongIndex);
      setActiveSong(songTitles[nextSongIndex]);
    }
  };

  //prettier-ignore
  return (
      <div className="songButtonElements">
        <div className="PrevButton" onClick={()=> handlePrevSong()}>
          <img src={PrevIcon} width={30} height={30} />
        </div>
        <div onClick={() => togglePlayPause()} className="PlayButton">
          {isPlaying ? (<img src={PauseIcon} width={30} height={30} />) : (<img src={PlayIcon} width={30} height={30} />)}
        </div>
        <div className="NextButton" onClick={()=> handleNextSong()}>
          <img src={NextIcon} width={30} height={30} />
        </div>
      </div>
  );
};
export default SongControls;
