import axios from "axios";
import React, { MouseEvent, useContext, useEffect, useState } from "react";
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
    
  );
};
export default Player;