import React, { useRef, useState } from "react";
import CloseIcon from "./../../images/close.svg";
import SidebarIcon from "./../../images/sidebar.svg";
import "./Sidebar.scss";

import PlaylistFetcher from "./playlist-fetcher/PlaylistFetcher";
//TODO add context and use in App to allow for state control on collapse
//TODO change opening so that it renders off screen and then translate right

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
          <div className="headerContainer">
            {/* <Resizer sidebarRef={sidebarRef} isResizing={isResizing} setIsResizing={setIsResizing} hideSidebar={hideSidebar}/> */}
            
            <div className="header">
              {/* TODO Instead of a header can be the navigation menu */}
              <h3>Playlist Menu</h3>
              <div className="close-button" onClick={toggleSidebar}>
                <img src={CloseIcon} width={30} height={30} />
              </div>
            </div>
            
              
            {/* TODO add routing here for different pages, may need context to pass the references to the main-content page */}
            
            <PlaylistFetcher />
          </div>
        )}


      </div>
      {/* If the sidebar is closed, show button */}
      {!sideBarOpenState && (
        // TODO convert to SVG Button
        <div className="open-button" onClick={toggleSidebar}>
          <img src={SidebarIcon} width={40} height={40} />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
