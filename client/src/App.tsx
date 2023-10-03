import React, { useContext, useEffect } from "react";
import "./App.scss";
import AppRouter from "./Router/AppRouter";
import { IndexProvider } from "./components/IndexContext";
import { PlayerProvider } from "./components/PlayerContext";
import { PlayingProvider } from "./components/PlayingContext";
import { PlaylistProvider } from "./components/PlaylistContext";
import PlaylistMain from "./components/PlaylistPages/PlaylistMain";
import { SongsProvider } from "./components/SongsContext";
import { SortedSongsProvider } from "./components/SortedSongsContext";
import { SortingLockProvider } from "./components/SortingLockContext";
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
            <SortedSongsProvider>
              <IndexProvider>
                <PlayingProvider>
                  <SortingLockProvider>

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
                  </SortingLockProvider>
                </PlayingProvider>
              </IndexProvider>
            </SortedSongsProvider>
          </SongsProvider>
        </PlayerProvider>
      </PlaylistProvider>
    </div>
  );
};

export default App;
