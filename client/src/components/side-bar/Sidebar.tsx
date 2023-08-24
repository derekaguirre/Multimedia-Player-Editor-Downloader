import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

import Resizer from "./Resizer";
import "./Sidebar.scss";
const API_URL = "http://localhost:4000";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}
interface PlaylistProps {
  _id: string;
  name: string;
}
const PlaylistMenu: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  //Local states
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [playlists, setPlaylists] = useState<PlaylistProps[]>([]);

  useEffect(() => {
    fetchAllPlaylists();
  }, []);

  //Logic for hiding the sidebar
  const hideSidebar = () => {
    if (sidebarRef.current) {
      sidebarRef.current.style.width = "0";
    }
  };

  //Fetch all playlist names and ids from the server
  const fetchAllPlaylists = async () => {
    try {
      // prettier-ignore
      const response = await axios.get(`${API_URL}/playlist/names`);
      console.log("FETCHING PLAYLISTS FOR SIDEBAR: ", response.data);
      setPlaylists(response.data);
    } catch (error) {
      console.error("Error fetching playlist data:", error);
    }
  };

  //Switching playlists
  const handlePlaylistClick = (playlistId: string, playlistName: string) => {
    console.log("Clicked on playlist with ID:", playlistId);
    
    localStorage.setItem("currentPlaylistId", playlistId);
    localStorage.setItem("currentPlaylistName", playlistName);
    console.log(localStorage);
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
      {/* May also need own context menu for editing playlist info or deleting a playlist */}
      <div className="playlist-items">
        <ul>
          {playlists.map((playlist) => (
            <li
              key={playlist._id}
              onClick={() => handlePlaylistClick(playlist._id, playlist.name)}
            >
              {playlist.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlaylistMenu;
