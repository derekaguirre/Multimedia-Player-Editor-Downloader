import axios from "axios";
import React, { MouseEvent, useContext, useEffect, useState } from "react";
// import ReactPlayer from "react-player";
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

  const { activeSong } = useContext(PlayerContext);
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

/*
Howler.js: 
Howler.js is a powerful and flexible JavaScript audio library that can be integrated into React applications. 
It provides features like audio playback, volume control, and the ability to create custom audio controllers.
GitHub: https://github.com/goldfire/howler.js


SoundManager 2: 
SoundManager 2 is a JavaScript API that wraps HTML5 and Flash audio APIs. 
It's customizable and can be used with React. You can build your custom audio player interface on top of it.
GitHub: https://github.com/scottschiller/SoundManager2

React Audio Player: 
This is a customizable React audio player component that allows you to create your custom controls and 
style the player to fit your application's design.
GitHub: https://github.com/justinmc/react-audio-player

React Media Player:
React Media Player is another customizable audio and video player for React applications.
It provides a set of customizable components, including the player itself and the controls, 
that you can style and customize to your liking.
GitHub: https://github.com/souporserious/react-media-player

React-JPlayer:
React-JPlayer is a React audio and video player library that provides a wide range of customization options,
including the ability to create custom controls and skins.
GitHub: https://github.com/jplayer/react-jPlayer
*/
