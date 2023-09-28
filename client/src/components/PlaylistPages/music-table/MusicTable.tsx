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

// TODO when currentPlaylistId does not exist
//   (prompt a button to create a playlist, can be handled with a popup for basic playlist info and a dropzone can be included)
//   (create a default empty playlist)

// TODO Refactor search out to own file
// TODO Add search to a div that will include sort functionality
// TODO highlight text found that matches the query
// TODO in settings add a selector for the headers to allow for more customized song table
// FOR EDITOR MODAL: https://www.youtube.com/watch?v=-yIsQPp31L0

// TODO check if memoization is needed. also verify if this approach that's commented out works and why.
// TODO on columns, add sorting by clicking on col. Check if its possible to implement in sub components.
// TODO in table, add 'date added' col, in 'Month D, YYYY' format
// TODO in table, add 'duration' col, in MM:SS format (**NEED TO ADD THIS FIELD TO DATABASE)
// TODO in table, add 'liked' col with correct state change and sending updates to the db

// Migrate fetch to own file and invoke at:
//  startup (implemented here and should be refactored out)
//  playlist selection (implemented here but can move to sidebar now, not sure if fesable due to state changes needing to re-render this component)
//  adding songs (needs to be re-implemented due to bug that caused re-rendering after every click inside of was inside of PlaylistMain)

interface PlaylistObject {
  currentPlaylistId: string; // Define the prop
}

const MusicTable: React.FC<PlaylistObject> = ({ currentPlaylistId }) => {
  //Local states
  const { songs, setSongs } = useContext(SongsContext);

  //Coordinate States
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredSongs, setFilteredSongs] = useState<SongObject[]>([]);

  //Check if playlist exists, if so memo the playlist data
  // const fetchedSongs = useMemo(() => {
  //   // Memoize the songs to prevent refetching on every render
  //   return songs;
  // }, [currentPlaylistId]);

  // Only fetch playlist data if there is a playlist id in local storage
  useEffect(() => {
    console.log("MUSIC TABLE RENDERED");
    if (currentPlaylistId) {
      console.log("Fetching playlist with ID: ", currentPlaylistId);
      fetchPlaylistData(currentPlaylistId);
    } else {
      console.log("Current playlist ID is empty. No playlist data fetched.");
    }
  }, [currentPlaylistId]);

  //prettier-ignore
  const fetchPlaylistData = async (playlistId: string) => {
    try {
      console.log("fetching songs for the table: ",`${API_URL}/playlist/${playlistId}/songs`);
      const response = await axios.get(`${API_URL}/playlist/${playlistId}/songs`);
      console.log("Fetching all songs from playlist:",`${playlistId} `,response.data);

      // Use type assertion to specify the correct type for setSongs
      setSongs(response.data as SongObject[]);
    } catch (error) {
      console.error("Error fetching playlist data:", error);
    }
  };

  // If search query is empty, show all songs, otherwise only show songs that match the search query
  //prettier-ignore
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSongs(songs);
    } else {
      const filtered = songs.filter(
        (song) =>
          //Possible queries the search will accept
          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.album.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  }, [songs, searchQuery]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  //prettier-ignore
  const columns = useMemo(
    () => [
      // { Header: "File ID", accessor: "_id"},
      // { Header: "File Name", accessor: "fileNameOriginal"},
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
      <div className="playlistTable">
      <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <table>
          {/* Verify implementation of sorting inside of here, if not then functionality will work in MusicTable */}
          <MusicTableHeader columns={columns} />
          <MusicTableContent entries={filteredSongs} columns={columns} />
        </table>
      </div>
    </div>
  );
};

export default MusicTable;
