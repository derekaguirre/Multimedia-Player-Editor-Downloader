import React, { MouseEvent, useContext, useEffect, useState } from "react";
import NextIcon from "../../../images/next.svg";
import PauseIcon from "../../../images/pause.svg";
import PlayIcon from "../../../images/play.svg";
import PrevIcon from "../../../images/prev.svg";
import { PlayerContext } from "./../../PlayerContext";
import "./MusicController.scss";
import TimeControls from "./time-controls/TimeControls";

//Can memorize both the playlist and the song or just use a state for the song
// local storage might be better for persistence.

//TODO implement prev / next song feature
//TODO maybe a shuffle
//TODO persistent volume

const MusicController: React.FC = () => {
  const { Howl } = require("howler");

  //Context states
  const { activeSong } = useContext(PlayerContext);
  //Local states
  const [currentHowl, setCurrentHowl] = useState<null | typeof Howl>(null);
  const [isPlaying, setIsPlaying] = useState(false); // State to track playing/paused status
  const [fullDuration, setFullDuration] = useState<number | null>(null); // State to store full duration

  useEffect(() => {
    handleSongPlayback(activeSong);
  }, [activeSong]);

  const handleSongPlayback = (activeSong: string | null) => {
    if (activeSong) {
      //If there is a song playing already when a new song is selected, unload the previous song
      if (currentHowl) {
        // setCurrentTime(0);
        console.log("null howl", currentHowl);
        currentHowl.unload();
        setIsPlaying(false);
      }

      //Set up the new song and overwrite states with new song
      const newHowl = new Howl({
        volume: 0.5,
        src: [activeSong],
        onload: function () {
          setFullDuration(newHowl.duration());
        },
      });
      setCurrentHowl(newHowl);
      setIsPlaying(true);
      newHowl.play();
    }
  };

  //Toggles between play and pause
  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      currentHowl.pause();
    } else {
      currentHowl.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="music-controller-container">
      <div className="songButtonElements">
        <div className="PrevButton">
          {/* <img src={PrevIcon} width={30} height={30} /> */}
        </div>
        {/* prettier-ignore */}
        <div onClick={() => togglePlayPause()} className="PlayButton">
          {isPlaying ? (<img src={PauseIcon} width={30} height={30} />) : (<img src={PlayIcon} width={30} height={30} />)}
        </div>
        <div className="NextButton">
          {/* <img src={NextIcon} width={30} height={30} /> */}
        </div>
      </div>
      <TimeControls currentHowl={currentHowl} fullDuration={fullDuration} />
    </div>
  );
};
export default MusicController;
