import axios from "axios";
import React, { MouseEvent, useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import ContextMenu from "../context-menu/ContextMenu";
import { SongObject, SongsContext } from "./../../SongsContext";
import MusicTableHeader from "./MusicTableHeader";

// import SearchBar from "../search-bar/SearchBar";
import { usePlaylist } from "../../PlaylistContext";
import "./MusicTable.scss";
const API_URL = "http://localhost:4000";

//Defining all the information stored in DB for reference

interface SortArrowProps {
  order?: "asc" | "desc";
}
const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
};

interface TableContentProps {
  entries: SongObject[];
  columns: { Header: string; accessor: string }[];
}

//Migrate fetch to own file and invoke at:
// startup TODO
// playlist selection (implemented here but can move to sidebar now)
// adding songs DONE (implemented inside of PlaylistMain)

const MusicTableContent: React.FC<TableContentProps> = ({entries,columns,}) => {
  // FOR EDITOR MODAL
  //https://www.youtube.com/watch?v=-yIsQPp31L0
  //Local states
  const { songs, setSongs } = useContext(SongsContext);
  const { currentPlaylistId } = usePlaylist(); // Context hook

  const [playingFile, setPlayingFile] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof SongObject | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  //Coordinate States
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState(initialContextMenu);
  console.log('Entries:', entries);
  console.log('Columns:', columns);
  useEffect(() => {
    console.log("Rendering MusicTable");
    // Only fetch playlist data if currentPlaylistId is not empty
    if (currentPlaylistId) {
      console.log("Fetching playlist with ID: ", currentPlaylistId);
      fetchPlaylistData(currentPlaylistId); // Fetch songs when the playlist ID changes
    } else
      console.log("Current playlist ID is empty. No playlist data fetched.");
  }, [currentPlaylistId]);

  const fetchPlaylistData = async (playlistId: string) => {
    // prettier-ignore
    try {
            console.log('fetching songs for the table: ', `${API_URL}/playlist/${playlistId}/songs`)
            const response = await axios.get(`${API_URL}/playlist/${playlistId}/songs`);
            console.log("Fetching all songs from playlist:", `${playlistId} `, response.data);
            setSongs(response.data);
        } catch (error) {
            console.error("Error fetching playlist data:", error);
        }
  };

  const handlePlay = (file: string) => {
    console.log("Can file play? ", ReactPlayer.canPlay(file));
    console.log("Attempting to play: ", file);
    setPlayingFile(file);
  };

  const SortArrow: React.FC<SortArrowProps> = ({ order }) => (
    <span>{order === "asc" ? "▲" : order === "desc" ? "▼" : ""}</span>
  );

  //Logic for sorting
  //TODO REFACTOR TO OWN FILE
  const handleSort = (column: keyof SongObject) => {
    if (!column) return;

    setSongs((prevSongs) => {
      const isAsc = sortColumn === column && sortDirection === "asc";
      const sortedSongs = [...prevSongs].sort((a, b) => {
        const aValue =
          typeof a[column] === "number" ? a[column]?.toString() : a[column];
        const bValue =
          typeof b[column] === "number" ? b[column]?.toString() : b[column];

        if (aValue && bValue) {
          if (aValue < bValue) return isAsc ? -1 : 1;
          if (aValue > bValue) return isAsc ? 1 : -1;
        }
        return 0;
      });

      sortedSongs.forEach((song) => {
        song.sortOrder = song === sortedSongs[0] ? sortDirection : undefined;
      });

      return sortedSongs;
    });

    setSortColumn(column);
    //prettier-ignore
    setSortDirection(sortColumn === column ? (sortDirection === "asc" ? "desc" : "asc") : "asc");
  };

  //prettier-ignore
  const handleContextMenu = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        e.preventDefault();
        const { pageX, pageY } = e
        setContextMenu({ show: true, x: pageX, y: pageY })
    }
  const contextMenuClose = () => setContextMenu(initialContextMenu);

  console.log(entries)
  // TODO states that handle which data the columns show, select name, title, album and only those show, add more options for other metadata
  return (
    <tbody>
  {entries.map((entry) => ( // Loop through each entry in the 'entries' array create a table row with a unique key based on entry ID
    <tr key={entry._id}> 
      {columns.map((column) => ( // Loop through each column in the 'columns' array
        <td key={column.accessor} className="table-cell"> {/* Create a table cell with a unique key */}
          {entry[column.accessor] || 'nothing'} {/* Display the data from the current entry and column, or 'nothing' if it's falsy */}
        </td>
      ))}
    </tr>
  ))}
</tbody>
  );
};

export default MusicTableContent;
