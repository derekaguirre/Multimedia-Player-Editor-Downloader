import React, { useEffect, useRef, useState } from "react";
import "./App.scss";
import AppRouter from "./Router/AppRouter";
import { PlaylistProvider } from "./components/PlaylistContext"; // import the context provider
import PlaylistMain from "./components/PlaylistPages/PlaylistMain";
import { SongsProvider } from "./components/SongsContext";
import Sidebar from "./components/side-bar/Sidebar";
import NextIcon from "./images/next.svg";
import PlayIcon from "./images/play.svg";
import PrevIcon from "./images/prev.svg";

const App: React.FC = () => {
  console.log("APP LOADED");

  // TODO refactor all of sidebar into its own component and subcomponents.
  //Ideally it should be imported as a button off to the side and then extend when clicked. Will be handled with states
  return (
    // TODO Music controller is falling off the page. Refactor css and formatting of DOM for consistency
    // F12 -> Elements -> Layout -> Flexbox overlays
    <div className="App">
      <PlaylistProvider>
        <div className="top-page">
          <div className="sidebar-container">
            {/* Renders side bar if open, otherwise renders button */}
            <Sidebar />
          </div>

          {/* PAGE CONTENT */}
          <div className="content-container">
              <SongsProvider>
                <PlaylistMain />
              </SongsProvider>
          </div>
        </div>
      </PlaylistProvider>

      {/* BOTTOM OF THE PAGE */}
      {/* PLAY BAR */}
      {/* TODO refactor into its own component  */}
      {/* prettier-ignore */}
      <div className="music-controller-container">
      <div className="songButtonElements">
          <div className="PrevButton"><img src={PrevIcon} width={30} height={30} /></div>
          <div className="PlayButton"><img src={PlayIcon} width={30} height={30} /></div>
          <div className="NextButton"><img src={NextIcon} width={30} height={30} /></div>
        </div>
        <div className="songTimeElements">
          <div className="currTime">0:00</div>
          <div className="playBar"></div>
          <div className="endTime">4:00</div>
        </div>
        
      </div>
    </div>
  );
};

export default App;
