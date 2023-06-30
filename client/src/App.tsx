import React, { useState } from "react";
import "./App.scss";
import AppRouter from "./Router/AppRouter";
import PlaylistMenu from "./components/PlaylistPages/playlist-menu/PlaylistMenu";

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    console.log("Toggling sidebar, is it currently open? ", sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="App">
      <div className="sidebar-container">
        <PlaylistMenu isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      <div className="content-container">
        {/* prettier-ignore */}
        <button className={`sidebar-toggle-button ${sidebarOpen ? "hidden" : ""}`} onClick={toggleSidebar}>
          Open Sidebar in App
        </button>

        <AppRouter />
      </div>
    </div>
  );
};

export default App;
