import React, { useContext, useEffect } from "react";
import "./App.scss";
import AppRouter from "./Router/AppRouter";
import { PlayerProvider } from "./components/PlayerContext";
import { PlaylistProvider } from "./components/PlaylistContext";
import PlaylistMain from "./components/PlaylistPages/PlaylistMain";
import { SongsProvider } from "./components/SongsContext";
import MusicController from "./components/music-controller/MusicController";
import Sidebar from "./components/side-bar/Sidebar";

const App: React.FC = () => {
  console.log("APP LOADED");
  
  // TODO ENV file for API key
  // TODO verify heierachy of providers
  // TODO Use navbar on sidebar to update/navigate router on page content section

  return (
    <div className="App">
      <PlaylistProvider>
        <PlayerProvider>
        <SongsProvider>

          <div className="top-page">
            {/* SIDEBAR */}

            <div className="sidebar-container">
              <Sidebar />
            </div>

            {/* PAGE CONTENT */}
            <div className="content-container">
                <PlaylistMain />
            </div>
          </div>
          {/* SONG CONTROLLER */}
          <MusicController />
          </SongsProvider>
        </PlayerProvider>
      </PlaylistProvider>
    </div>
  );
};

export default App;
