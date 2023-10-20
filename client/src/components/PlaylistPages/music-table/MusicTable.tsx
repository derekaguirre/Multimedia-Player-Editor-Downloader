import axios from "axios";
//prettier-ignore
import React, { useContext, useEffect, useMemo, useState, } from "react";
import { SongObject, SongsContext } from "../../Contexts/SongsContext";
import "./MusicTable.scss";
import MusicTableContent from "./table-content/MusicTableContent";
import MusicTableHeader from "./table-header/MusicTableHeader";
import TableSearch from "./table-search/TableSearch";
const API_URL = "http://localhost:4000";

// TODO when currentPlaylistId does not exist
//   (prompt a button to create a playlist, can be handled with a popup for basic playlist info and a dropzone can be included)
//   (create a default empty playlist)

// TODO in settings add a selector for the headers to allow for more customized song table
// FOR EDITOR MODAL: https://www.youtube.com/watch?v=-yIsQPp31L0

// TODO check if memoization is needed. also verify if this approach that's commented out works and why.
// TODO in table, add 'liked' col with correct state change and sending updates to the db

// TODO VERIFY IMPLEMENTATIONS OF FETCHING
// Migrate fetch to own file and invoke at:
//  startup (implemented here and should be refactored out)
//  playlist selection (implemented here but can move to sidebar now, not sure if fesable due to state changes needing to re-render this component)
//  adding songs (needs to be re-implemented due to bug that caused re-rendering after every click inside of was inside of PlaylistMain)

interface PlaylistObject {
  currentPlaylistId: string;
}

// Methods to help with data formatting---
//TODO also implemented inside of TimeControls.tsx. Can refactor into a TableUtils.tsx component and export what's needed maybe?

export function formatDuration(durationInSeconds: number | undefined) {
  if (durationInSeconds === undefined) {
    return "N/A"; // Handle the case where duration is undefined
  }
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  const formattedMinutes = minutes > 0 ? minutes.toString() : "0";
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();

  return `${formattedMinutes}:${formattedSeconds}`;
}

export function formatDateAdded(isoDate: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", options);
}

//----

const MusicTable: React.FC<PlaylistObject> = ({ currentPlaylistId }) => {
  const { songs, setSongs } = useContext(SongsContext);
  


  //States for searching
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState<SongObject[]>([]);

  //States for sorting
  //TODO update sorting order to use local storage
  const [sortingOrder, setSortingOrder] = useState<string>(""); 
  const [clickedHeader, setClickedHeader] = useState<string | null>(null);

  // Only fetch playlist data if there is a playlist id in local storage, triggered every time playlist id changes
  useEffect(() => {
    if (currentPlaylistId) {
      fetchPlaylistData(currentPlaylistId);
    } else {
      console.log("Current playlist ID does not exist. No playlist data fetched.");
    }
  }, [currentPlaylistId]);

  //prettier-ignore
  const fetchPlaylistData = async (playlistId: string) => {
    try {
      const response = await axios.get(`${API_URL}/playlist/${playlistId}/songs`);
      console.log("MusicTable fetching songs for the table: ",`${API_URL}/playlist/${playlistId}/songs`, response.data);
      setSongs(response.data);
    } catch (error) {
      console.error("Error fetching playlist data:", error);
    }
  };

  //TODO make a selector for the header/accessor pairs so this doesn't need to be hard coded
  //prettier-ignore
  const columns = useMemo(
    () => [
      // { Header: "File ID", accessor: "_id"},
      {
        Header: "Image",
        accessor: "image[0].imageBuffer",
      },
      { Header: "Title", accessor: "title" },
      { Header: "Artist", accessor: "artist" },
      { Header: "Album", accessor: "album" },
      {
        Header: "Date Added",
        accessor: "dateAdded",
        Cell: ({ value }: { value: string }) => formatDateAdded(value),
      },
      {
        Header: "Duration",
        accessor: "duration",
        Cell: ({ value }: { value: number | undefined }) => formatDuration(value),
      },
    ],
    []
  );

  //TODO remove tableElementContainer
  return (
    <div className="tableElementContainer">
      <div className="playlistTable">
        <TableSearch
          songs={songs}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setFilteredSongs={setFilteredSongs}
        />
        <table>
          <MusicTableHeader
            columns={columns}
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
