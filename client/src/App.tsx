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


// TODO
// Seek bar
// Search bar
// Images on song entries
// Implement playlist functionality, forward and backward through songs
// Implement autoplay
// Implement shuffle

  return (
    <div className="App">
      <PlayerProvider>
        <PlaylistProvider>
          <div className="top-page">
            <div className="sidebar-container">
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

        <MusicController />
      </PlayerProvider>
    </div>
  );
};

export default App;
