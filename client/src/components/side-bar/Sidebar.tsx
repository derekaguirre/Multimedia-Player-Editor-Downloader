import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { PlaylistContext } from "./../PlaylistContext";

import Resizer from "./Resizer";
import "./Sidebar.scss";
const API_URL = "http://localhost:4000";
//PROPS FOR SIDE BAR
//TODO refactor the name and id fetching to another file.
//TODO add context and use in App to allow for state control on collapse
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
    //TODO move fetching out into higher level
    fetchAllPlaylists();
  console.log("Local Storage:", localStorage);

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

  const { setCurrentPlaylistId, setCurrentPlaylistName, currentPlaylistId, currentPlaylistName } = useContext(PlaylistContext);
  console.log("PlaylistMenu - currentPlaylistId:", currentPlaylistId);
  //Switching playlists
  const handlePlaylistClick = (playlistId: string, playlistName: string) => {
    console.log("Clicked on playlist with ID:", playlistId);
    console.log("ID Before Click:", currentPlaylistId);
    console.log("Name Before Click:", currentPlaylistName);

    localStorage.setItem("currentPlaylistId", playlistId);
    localStorage.setItem("currentPlaylistName", playlistName);

    setCurrentPlaylistId(playlistId);
    setCurrentPlaylistName(playlistName);
    
    console.log( "Sidebar Playlist ID:", playlistId, "Sidebar Playlist Name:", playlistName);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`} ref={sidebarRef}>
      {/* <Resizer
        sidebarRef={sidebarRef}
        isResizing={isResizing}
        setIsResizing={setIsResizing}
        hideSidebar={hideSidebar} // Pass the hideSidebar function
      /> */}

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
