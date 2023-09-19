import axios from "axios";
import React, { MouseEvent, useContext, useEffect, useState } from "react";
import NextIcon from "../../../images/next.svg";
import PauseIcon from "../../../images/pause.svg";
import PlayIcon from "../../../images/play.svg";
import PrevIcon from "../../../images/prev.svg";
import { PlayerContext } from "./../../PlayerContext";

import "./MusicController.scss";
import Player from "./Player";

const API_URL = "http://localhost:4000";


const MusicController: React.FC = () => {
  const { Howl } = require("howler");
  const [currentHowl, setCurrentHowl] = useState<null | typeof Howl>(null); // Use typeof Howl
  const [isPlaying, setIsPlaying] = useState(false); // State to track playing/paused status
  const { activeSong } = useContext(PlayerContext);

  var songId = 0;
  //Local states
  useEffect(() => {
    if (activeSong) {
      if (currentHowl) {
        // If a song is already playing, stop it before playing the new one
        currentHowl.stop();
      }

      const newHowl = new Howl({
        volume: 0.5,
        src: [activeSong],
        onend: function () {
          console.log("Finished playing");
        },
      });

      setCurrentHowl(newHowl);
      setIsPlaying(true);
      newHowl.play();
    }
  }, [activeSong]);

  // //Formatting names to be read by music player
  // const handlePlaySong = (id: number) => {
  //   console.log("In MusicController Playing:", id);
  //   currentSong.pause(id)
  //   songId = currentSong.play();
  //   // console.log(currentSong.onPlay())
  // };

  const togglePlayPause = () => {
    if (currentHowl) {
      if (isPlaying) {
        // If currently playing, pause the music
        currentHowl.pause();
        setIsPlaying(false);
      } else {
        // If paused, resume the music
        currentHowl.play();
        setIsPlaying(true);
      }
    }
  };

  //PROBLEMS WITH CURRENT APPROACH:
  //Players are displayed for every song entry
  //Switching SONGS does not restart the song. only continues where it left off. this is due to one player per entry

  //TODO Ideally I should be using this component inside of the SongController(IN PROGRESS) component
  //Can memorize both the playlist and the song or just use a state for the song
  // Need to use either global state or context. maybe even local storage to keep it consistently playing to prevent rerenders. local storage might be better for persistence.

  //TODO implement prev / next song feature
  //TODO maybe a shuffle
  //TODO implement the play/pause button

  return (
    <div className="music-controller-container">
      {/* <Player /> */}
      <div className="songButtonElements">
        <div className="PrevButton">
          {/* <img src={PrevIcon} width={30} height={30} /> */}
        </div>
        <div onClick={() => togglePlayPause()} className="PlayButton">
          {isPlaying ? (
            // Display pause icon when music is playing
            <img src={PauseIcon} width={30} height={30} />
          ) : (
            // Display play icon when music is paused
            <img src={PlayIcon} width={30} height={30} />
          )}
        </div>
        <div className="NextButton">
          {/* <img src={NextIcon} width={30} height={30} /> */}
        </div>
      </div>
      <div className="songTimeElements">
        <div className="currTime">0:00</div>
        <div className="playBar"></div>
        <div className="endTime">4:00</div>
      </div>
    </div>
  );
};
export default MusicController;
