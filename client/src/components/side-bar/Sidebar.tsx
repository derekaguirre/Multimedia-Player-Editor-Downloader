import React, { useRef, useState } from "react";
import PlaylistFetcher from "./PlaylistFetcher";
import "./Sidebar.scss";
//TODO add context and use in App to allow for state control on collapse
interface SidebarProps {
  isOpen: boolean;
  setSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({  }) => {
  //Local states
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  //Logic for hiding the sidebar
  const hideSidebar = () => {
    if (sidebarRef.current) {
      sidebarRef.current.style.width = "0";
    }
  };

  return (
    <div className={`sidebar`} >
      {/* <Resizer sidebarRef={sidebarRef} isResizing={isResizing} setIsResizing={setIsResizing} hideSidebar={hideSidebar}/> */}

      <div className="header">
        <h3>Playlist Menu</h3>
      </div>
      
      {/* TODO convert to SVG Button */}
      <div className="close-button" onClick={hideSidebar}>
        X
      </div>
      
      <PlaylistFetcher />
    </div>
  );
};

export default Sidebar;
