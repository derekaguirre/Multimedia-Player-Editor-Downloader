import React, { useEffect, useRef, useState } from "react";
import "./App.scss";
import AppRouter from "./Router/AppRouter";
import PlaylistMain from "./components/PlaylistPages/PlaylistMain";
import Sidebar from "./components/side-bar/Sidebar";

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
      <div className="sidebar-container">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      <div className="content-container">
        {/* prettier-ignore */}
        {isButtonVisible && (
          <button className={`sidebar-toggle-button ${sidebarOpen ? "hidden" : ""}`} onClick={toggleSidebar}>
            Open Sidebar in App
          </button>
        )}

        <AppRouter />
      </div>
    </div>
  );
};

export default App;
