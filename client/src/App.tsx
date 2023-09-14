import React from "react";
import "./App.scss";
import AppRouter from "./Router/AppRouter";
import { PlayerProvider } from "./components/PlayerContext";
import { PlaylistProvider } from "./components/PlaylistContext";
import PlaylistMain from "./components/PlaylistPages/PlaylistMain";
import MusicController from "./components/PlaylistPages/music-controller/MusicController";
import { SongsProvider } from "./components/SongsContext";
import Sidebar from "./components/side-bar/Sidebar";

const App: React.FC = () => {
  console.log("APP LOADED");

  // TODO refactor all of sidebar into its own component and subcomponents.
  //Ideally it should be imported as a button off to the side and then extend when clicked. Will be handled with states
  return (
    // TODO Music controller is falling off the page. Refactor css and formatting of DOM for consistency
    // F12 -> Elements -> Layout -> Flexbox overlays
    <div className="App">
      <PlayerProvider>
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

        {/* BOTTOM OF THE PAGE PLAY BAR */}
        <MusicController />
      </PlayerProvider>
    </div>
  );
};

export default App;
