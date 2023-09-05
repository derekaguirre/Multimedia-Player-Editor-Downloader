import React, { useRef, useState } from "react";
import "./Sidebar.scss";
import PlaylistFetcher from "./playlist-fetcher/PlaylistFetcher";
//TODO add context and use in App to allow for state control on collapse

const Sidebar: React.FC = () => {
  //Local states
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sideBarOpenState, setsideBarOpenState] = useState(true);
  const [isResizing, setIsResizing] = useState(false);

  //Logic for hiding the sidebar
  const toggleSidebar = () => {
    if (sidebarRef.current) {
      setsideBarOpenState(!sideBarOpenState);
    }
  };

  return (
    <div className="sidebar-container">
      {/* prettier-ignore */}
      <div className={`sidebar ${sideBarOpenState ? "open" : "closed"}`} ref={sidebarRef}>
        {sideBarOpenState && (
          <>
            {/* <Resizer sidebarRef={sidebarRef} isResizing={isResizing} setIsResizing={setIsResizing} hideSidebar={hideSidebar}/> */}
            
            <div className="header">
              {/* TODO convert to SVG Button */}
              <div className="close-button" onClick={toggleSidebar}>
                X
              </div>
              
              <h3>Playlist Menu</h3>
            </div>
            
            {/* TODO add routing here for different pages, may need context to pass the references to the main-content page */}
            
            <PlaylistFetcher />
          </>
        )}


      </div>
      {/* If the sidebar is closed, show button */}
      {!sideBarOpenState && (
        // TODO convert to SVG Button
        <div className="open-button" onClick={toggleSidebar}>
          Open Sidebar
        </div>
      )}
    </div>
  );
};

export default Sidebar;
