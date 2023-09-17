import axios from "axios";
import React, { MouseEvent, useContext, useEffect, useState } from "react";
// import ReactPlayer from "react-player";
import { PlayerContext } from "../../PlayerContext";
// import { Howl, Howler } from 'howler';
import { SongObject, SongsContext } from "../../SongsContext";


// import ContextMenu from "../context-menu/ContextMenu";
// import SearchBar from "../search-bar/SearchBar";

const API_URL = "http://localhost:4000";

const Player: React.FC = () => {
  //Local states
  useEffect(() => {
    console.log("PLAYER RENDERED");
  }, []);


  //Test play song
  // const { activeSong } = useContext(PlayerContext);


  
  //TODO use local storage for persistence.

  //TODO implement prev / next song feature
  //TODO maybe a shuffle
  //TODO implement the play/pause button

  return (
    <div>Player</div>
    // <ReactPlayer
    //   className="react-player"
    //   url={activeSong || ""}
    //   playing={true}
    //   controls={true}
    //   width="640px"
    //   height="360px"
    //   volume={0.4}
    //   onEnded={() => {
    //     console.log("onEnded");
    //   }}
    //   onError={(error) => {
    //     console.error("Error playing media:", error);
    //   }}
    // />
  );
};
export default Player;