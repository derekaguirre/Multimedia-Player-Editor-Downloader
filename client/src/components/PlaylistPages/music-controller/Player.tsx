import axios from "axios";
import React, { MouseEvent, useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { PlayerContext } from "../../PlayerContext";
import { SongObject, SongsContext } from "../../SongsContext";

// import ContextMenu from "../context-menu/ContextMenu";
// import SearchBar from "../search-bar/SearchBar";

const API_URL = "http://localhost:4000";

const Player: React.FC = () => {
  //Local states
  useEffect(() => {
    console.log("PLAYER RENDERED");
  }, []);

  const {activeSong} = useContext(PlayerContext);

  //PROBLEMS WITH CURRENT APPROACH:
  //Players are displayed for every song entry
  //Switching SONGS does not restart the song. only continues where it left off. this is due to one player per entry

  //Switching to another playlist does a few things:
  //  stops the song if the next playlist does not contain the song
  //  restarts the song if it does exist. it is playing the song from the new playlist. I believe it re-fetches the song and plays the one from the new playlist. not the old one

  //TODO Ideally I should be using this component inside of the SongController(IN PROGRESS) component
    //Can memorize both the playlist and the song or just use a state for the song
    // Need to use either global state or context. maybe even local storage to keep it consistently playing to prevent rerenders. local storage might be better for persistence.
    
  //TODO implement prev / next song feature
  //TODO maybe a shuffle
  //TODO implement the play/pause button
  
  return (
    <ReactPlayer
      className="react-player"
      url={activeSong || ''}
      playing = {true}
      // controls={true}
      // width="100px"
      // height="100px"
      volume={0.4}
      onError={(error) => {
        console.error("Error playing media:", error);
      }}
    />
  );
};
export default Player;
