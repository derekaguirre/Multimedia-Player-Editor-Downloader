import axios from "axios";
import React, { MouseEvent, useContext, useEffect, useState } from "react";
import NextIcon from "../../../images/next.svg";
import PlayIcon from "../../../images/play.svg";
import PrevIcon from "../../../images/prev.svg";
import { PlayerContext } from "./../../PlayerContext";

import "./MusicController.scss";
import Player from "./Player";
// import ContextMenu from "../context-menu/ContextMenu";
// import SearchBar from "../search-bar/SearchBar";



const API_URL = "http://localhost:4000";
// interface PlayerProps {
//   playing: boolean;
//   currentSong: string;
// }

const MusicController: React.FC = () => {
  const { activeSong, setActiveSong } = useContext(PlayerContext);
  console.log("activesong changed:", activeSong)
  //Local states
  useEffect(() => {
    console.log("CONTROLLER RENDERED");
  });

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
          <Player/>
      <div className="songButtonElements">
        <div className="PrevButton">
          {/* <img src={PrevIcon} width={30} height={30} /> */}
        </div>
        <div className="PlayButton">
          {/* <img src={PlayIcon} width={30} height={30} /> */}
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
