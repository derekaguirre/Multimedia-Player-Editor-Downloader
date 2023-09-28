import axios from "axios";
//prettier-ignore
import React, { MouseEvent, useContext, useEffect, useMemo, useState, } from "react";
import ContextMenu from "../context-menu/ContextMenu";
import { SongObject, SongsContext } from "./../../SongsContext";
import MusicTableHeader from "./table-header/MusicTableHeader";
// import SearchBar from "../search-bar/SearchBar";
import "./MusicTable.scss";
import MusicTableContent from "./table-content/MusicTableContent";
import TableSearch from "./table-search/TableSearch";
const API_URL = "http://localhost:4000";

// TODO when currentPlaylistId does not exist
//   (prompt a button to create a playlist, can be handled with a popup for basic playlist info and a dropzone can be included)
//   (create a default empty playlist)

// TODO in settings add a selector for the headers to allow for more customized song table
// FOR EDITOR MODAL: https://www.youtube.com/watch?v=-yIsQPp31L0

// TODO check if memoization is needed. also verify if this approach that's commented out works and why.
// TODO in table, add 'date added' col, in 'Month D, YYYY' format
// TODO in table, add 'duration' col, in MM:SS format (**NEED TO ADD THIS FIELD TO DATABASE)
// TODO in table, add 'liked' col with correct state change and sending updates to the db

// Migrate fetch to own file and invoke at:
//  startup (implemented here and should be refactored out)
//  playlist selection (implemented here but can move to sidebar now, not sure if fesable due to state changes needing to re-render this component)
//  adding songs (needs to be re-implemented due to bug that caused re-rendering after every click inside of was inside of PlaylistMain)

interface PlaylistObject {
  currentPlaylistId: string;
}

const MusicTable: React.FC<PlaylistObject> = ({ currentPlaylistId }) => {
  const { songs, setSongs } = useContext(SongsContext);

  //States for searching
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState<SongObject[]>([]);

  //States for sorting
  const [sortingOrder, setSortingOrder] = useState<string | null>(null);
  const [clickedHeader, setClickedHeader] = useState<string | null>(null);

  const handleHeaderClick = () => {
    // Toggle between "asc" and "desc" on header click
    setSortingOrder(sortingOrder === "asc" ? "desc" : "asc");
  };

  //Check if playlist exists, if so memo the playlist data
  // const fetchedSongs = useMemo(() => {
  //   // Memoize the songs to prevent refetching on every render
  //   return songs;
  // }, [currentPlaylistId]);

  // Only fetch playlist data if there is a playlist id in local storage
  // Playlist is fetched every time the sidebar changes the currentPlaylistId
  console.log("MUSIC TABLE SORT ORDER:", sortingOrder);
  useEffect(() => {
    console.log("MUSIC TABLE RENDERED");
    if (currentPlaylistId) {
      console.log("MusicTable fetching playlist with ID: ", currentPlaylistId);
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


  //TODO make a selector for the header/accessor pairs so this doesn't need to be hard coded
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

  // dropzone on table WAS CAUSING THE REFRESHING ON EVERY CLICK OF AN ELEMENT specifically rootprops
  console.log("MUSIC TABLE RENDERED");

  //TODO remove tableElementContainer
  return (
    <div className="tableElementContainer">
      <div className="playlistTable">
        <TableSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setFilteredSongs={setFilteredSongs}
        />
        <table>
          <MusicTableHeader
            columns={columns}
            sortingOrder={sortingOrder}
            setSortingOrder={setSortingOrder}
            setClickedHeader={setClickedHeader}
          />
          <MusicTableContent
            entries={filteredSongs}
            columns={columns}
            searchQuery={searchQuery}
            sortingOrder={sortingOrder ?? ""}
            clickedHeader={clickedHeader}
          />
        </table>
      </div>
    </div>
  );
};

export default MusicTable;
