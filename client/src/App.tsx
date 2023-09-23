import React, { useContext, useEffect } from "react";
import "./App.scss";
import AppRouter from "./Router/AppRouter";
import { PlayerProvider } from "./components/PlayerContext";
import { PlaylistProvider } from "./components/PlaylistContext";
import PlaylistMain from "./components/PlaylistPages/PlaylistMain";
import MusicController from "./components/PlaylistPages/music-controller/MusicController";
// import { SeekContext, SeekProvider } from "./components/SeekContext";
import { SongsProvider } from "./components/SongsContext";
import Sidebar from "./components/side-bar/Sidebar";


const App: React.FC = () => {
  console.log("APP LOADED");
  // const { isSeeking, setIsSeeking } = useContext(SeekContext);

  
  // useEffect(() => {
  //   // Add a global mouseup event listener to handle mouse button release
  //   const handleMouseUp = () => {
  //     // Set isSeeking to false when the mouse button is released
  //     console.log("APP DISABLE SEEK");
  //     setIsSeeking(false);
  //   };

  //   // Attach the event listener
  //   document.addEventListener("mouseup", handleMouseUp);

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     document.removeEventListener("mouseup", handleMouseUp);
  //   };
  // }, [setIsSeeking]);
    

  
// TODO
// Seek bar
// Search bar
// Images on song entries
// Implement playlist functionality, forward and backward through songs
// Implement autoplay
// Implement shuffle
console.log("APP SEEKING")
  return (
    <div className="App">
      {/* <SeekProvider> */}

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
      {/* </SeekProvider> */}
    </div>
  );
};

export default App;
