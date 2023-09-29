import React, { useContext, useEffect, useState } from "react";
import NextIcon from "../../../images/next.svg";
import PauseIcon from "../../../images/pause.svg";
import PrevIcon from "../../../images/prev.svg";
import PlayIcon from "./../../../images/play.svg";
import "./SongControls.scss";

// TODO persist active song name and current time in song using local storage to continue listening session
interface SongControlProps{
    currentHowl: Howl;
    isPlaying: boolean;
    setIsPlaying: (isPlaying: boolean) => void;
}

const SongControls: React.FC<SongControlProps> = ({currentHowl, isPlaying, setIsPlaying}) => {
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

  //prettier-ignore
  return (
      <div className="songButtonElements">
        <div className="PrevButton">
          <img src={PrevIcon} width={30} height={30} />
        </div>
        <div onClick={() => togglePlayPause()} className="PlayButton">
          {isPlaying ? (<img src={PauseIcon} width={30} height={30} />) : (<img src={PlayIcon} width={30} height={30} />)}
        </div>
        <div className="NextButton">
          <img src={NextIcon} width={30} height={30} />
        </div>
      </div>
  );
};
export default SongControls;
