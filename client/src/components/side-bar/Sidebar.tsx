import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { PlaylistContext } from "./../PlaylistContext";

import Resizer from "./Resizer";
import "./Sidebar.scss";
const API_URL = "http://localhost:4000";
//PROPS FOR SIDE BAR
//TODO seek possible refactor for fetching the name and id.
//TODO add context and use in App to allow for state control on collapse
interface SidebarProps {
  isOpen: boolean;
  setSidebar: () => void;
}
interface PlaylistProps {
  _id: string;
  name: string;
}

const Sidebar: React.FC<SidebarProps> = ({  }) => {
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

  //Switch playlists utilizing context
  const { setCurrentPlaylistId, setCurrentPlaylistName } =
    useContext(PlaylistContext);
  const handlePlaylistClick = (playlistId: string, playlistName: string) => {
    console.log("Clicked on playlist with ID:", playlistId);

    localStorage.setItem("currentPlaylistId", playlistId);
    localStorage.setItem("currentPlaylistName", playlistName);

    setCurrentPlaylistId(playlistId);
    setCurrentPlaylistName(playlistName);
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
      
      {/* TODO refactor into own component, which will move fetching outside and make the components more cohesive */}
      <div className="playlist-items">
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist._id} onClick={() => handlePlaylistClick(playlist._id, playlist.name)}>
              {playlist.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
