import React, { useEffect, useRef, useState } from "react";
import "./App.scss";
import AppRouter from "./Router/AppRouter";
import PlaylistMain from "./components/PlaylistPages/PlaylistMain";
import Sidebar from "./components/side-bar/Sidebar";
import NextIcon from "./images/next.svg";
import PlayIcon from "./images/play.svg";
import PrevIcon from "./images/prev.svg";

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isButtonVisible, setIsButtonVisible] = useState(!sidebarOpen); // Initialize with the opposite value of sidebarOpen

  const toggleSidebar = () => {
    console.log("Toggling sidebar, is it currently open? ", sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkSidebarWidth = () => {
      const sidebarWidth = sidebarRef.current?.offsetWidth || 0;
      setIsButtonVisible(sidebarWidth === 0);
    };

    window.addEventListener("resize", checkSidebarWidth);
    checkSidebarWidth();

    return () => {
      window.removeEventListener("resize", checkSidebarWidth);
    };
  }, []);

  return (
    <div className="App">
      {/* TOP OF THE PAGE */}
      <div className="top-page">
        {/* SIDE BAR */}
        <div className="sidebar-container">
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        {/* PAGE CONTENT */}
        <div className="content-container">
          {/* prettier-ignore */}
          {isButtonVisible && (
            <button
              className={`sidebar-toggle-button ${sidebarOpen ? "hidden" : ""}`}
              onClick={toggleSidebar}
            >
              Open Sidebar in App
            </button>
          )}
          <PlaylistMain />
        </div>
      </div>

      {/* BOTTOM OF THE PAGE */}
      {/* PLAY BAR */}
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
