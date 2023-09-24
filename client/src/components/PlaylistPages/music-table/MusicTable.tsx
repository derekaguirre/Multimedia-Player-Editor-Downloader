import axios from "axios";
//prettier-ignore
import React, { MouseEvent, useContext, useEffect, useMemo, useState, } from "react";
import ContextMenu from "../context-menu/ContextMenu";
import { SongObject, SongsContext } from "./../../SongsContext";
import MusicTableHeader from "./table-header/MusicTableHeader";
// import SearchBar from "../search-bar/SearchBar";
import "./MusicTable.scss";
import MusicTableContent from "./table-content/MusicTableContent";
const API_URL = "http://localhost:4000";

// TODO Implement search bar
// Migrate fetch to own file and invoke at:
//  startup TODO
//  playlist selection (implemented here but can move to sidebar now)
//  adding songs DONE (implemented inside of PlaylistMain)

//Defining all the information stored in DB for reference


interface PlaylistObject {
  currentPlaylistId: string; // Define the prop
}

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
};

const MusicTable: React.FC<PlaylistObject> = ({ currentPlaylistId }) => {
  // FOR EDITOR MODAL: https://www.youtube.com/watch?v=-yIsQPp31L0
  //Local states
  const { songs, setSongs } = useContext(SongsContext);

  //Coordinate States
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState(initialContextMenu);

  //Check if playlist exists, if so memo the playlist data
  // const fetchedSongs = useMemo(() => {

  //   // Memoize the songs to prevent refetching on every render
  //   return songs;
  // }, [currentPlaylistId]);

  useEffect(() => {
    console.log("MUSIC TABLE RENDERED");
    if (currentPlaylistId) {
      // Only fetch playlist data if currentPlaylistId is not empty
      console.log("Fetching playlist with ID: ", currentPlaylistId);
      fetchPlaylistData(currentPlaylistId);
    } else {
      console.log("Current playlist ID is empty. No playlist data fetched.");
    }
  }, [currentPlaylistId]);

  const fetchPlaylistData = async (playlistId: string) => {
    // prettier-ignore
    try {
      console.log('fetching songs for the table: ', `${API_URL}/playlist/${playlistId}/songs`)
      const response = await axios.get(`${API_URL}/playlist/${playlistId}/songs`);
      console.log( "Fetching all songs from playlist:", `${playlistId} `, response.data);
      setSongs(response.data);
    } catch (error) {
      console.error("Error fetching playlist data:", error);
    }
  };
  //prettier-ignore
  const handleContextMenu = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) =>{
    e.preventDefault();
    const {pageX, pageY} = e
    setContextMenu({show: true, x: pageX, y: pageY})
  }
  const contextMenuClose = () => setContextMenu(initialContextMenu);

  // TODO add a selector for the headers and accessors to make display dynamic
  //prettier-ignore
  const columns = useMemo(
    () => [
      // { Header: "File ID", accessor: "_id"},
      { Header: "File Name", accessor: "fileNameOriginal"},
      { Header: "Title", accessor: "title"},
      { Header: "Artist", accessor: "artist"},
      { Header: "Album", accessor: "album"},
    ],
    []
  );
  //Clicking refreshing the page be a result of:
  //  useeffects
  //  context on player
  //  memoization
  //  table population
  // dropzone on table WAS CAUSING THE REFRESHING ON EVERY CLICK OF AN ELEMENT specifically rootprops
  console.log("MUSIC TABLE RENDERED");

  //TODO remove tableElementContainer
  return (
    // prettier-ignore
    <div className="tableElementContainer">
      {/* {contextMenu.show && (<ContextMenu x={contextMenu.x} y={contextMenu.y} closeContextMenu={contextMenuClose}/>)} */}
      <div className="playlistTable" onContextMenu={(e) => {handleContextMenu(e); }}>
        <table>
          <MusicTableHeader columns={columns} />
          <MusicTableContent entries={songs} columns={columns} />
        </table>
      </div>
    </div>
  );
};

export default MusicTable;
