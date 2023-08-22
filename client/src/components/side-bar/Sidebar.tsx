import React, { useRef, useState } from "react";
import Resizer from "./Resizer";
import "./Sidebar.scss";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const PlaylistMenu: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  const hideSidebar = () => {
    if (sidebarRef.current) {
      sidebarRef.current.style.width = "0";
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`} ref={sidebarRef}>
      <Resizer
        sidebarRef={sidebarRef}
        isResizing={isResizing}
        setIsResizing={setIsResizing}
        hideSidebar={hideSidebar} // Pass the hideSidebar function
      />

      <div className="header">
        <h3>Playlist Menu</h3>
      </div>
      {/* Change button to svg and update styling */}
      <div className="close-button" onClick={hideSidebar}>
        X
      </div>
      {/* Populate with playlist names from backend */}
      {/* May also need own context menu for editing playlist info or deleting a playlist */}
      <div className="playlist-items">
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 4</li>
          <li>Item 5</li>
          <li>Item 6...............</li>
        </ul>
      </div>
    </div>
  );
};

export default PlaylistMenu;
