import React, { useEffect } from "react";
import "./App.scss";
import AppRouter from "./Router/AppRouter";
import MusicController from "./components/MusicControls/MusicController";
import PlaylistMain from "./components/PlaylistPages/PlaylistMain";
import Sidebar from "./components/Sidebar/Sidebar";
import { EditProvider } from "./components/StateContexts/EditContext";
import { IndexProvider } from "./components/StateContexts/IndexContext";
import { PlayerProvider } from "./components/StateContexts/PlayerContext";
import { PlayingProvider } from "./components/StateContexts/PlayingContext";
import { PlaylistProvider } from "./components/StateContexts/PlaylistContext";
import { SongsProvider } from "./components/StateContexts/SongsContext";
import { SortedSongsProvider } from "./components/StateContexts/SortedSongsContext";
import { SortingLockProvider } from "./components/StateContexts/SortingLockContext";


const App: React.FC = () => {
  console.log("APP LOADED");
  useEffect(() => {
    function preventContextMenu(event: MouseEvent) {
      event.preventDefault();
    }
  
    document.addEventListener("contextmenu", preventContextMenu);
    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);
  // TODO ENV file for API key
  // TODO verify heierachy of providers
  // TODO Use navbar/router on sidebar to update/navigate pages

  return (
    <div className="App">
      <PlaylistProvider>
        <EditProvider>
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
        </EditProvider>
      </PlaylistProvider>
    </div>
  );
};

export default App;
