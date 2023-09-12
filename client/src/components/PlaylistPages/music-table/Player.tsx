import axios from "axios";
import React, { MouseEvent, useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { SongObject, SongsContext } from "./../../SongsContext";
import "./MusicTableHeader.scss";

// import ContextMenu from "../context-menu/ContextMenu";
// import SearchBar from "../search-bar/SearchBar";

const API_URL = "http://localhost:4000";
interface PlayerProps {
  playing: boolean;
  currentSong: string;
}

const Player: React.FC<PlayerProps> = ({ playing, currentSong }) => {
  //Local states
  useEffect(() => {
    console.log("PLAYER RENDERED");
  }, []);

  //Coordinate States

  return (
    <ReactPlayer
      className="react-player"
      url={currentSong}
      playing={playing}
    //   controls={true}
      width="0px"
      height="0px"
      volume={0.4}
      onError={(error) => {
        console.error("Error playing media:", error);
      }}
    />
  );
};
export default Player;
