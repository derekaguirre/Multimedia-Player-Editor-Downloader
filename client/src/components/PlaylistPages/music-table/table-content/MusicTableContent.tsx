import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { IndexContext } from "../../../Contexts/IndexContext";
import { PlayerContext } from "../../../Contexts/PlayerContext";
import { PlayingContext } from "../../../Contexts/PlayingContext";
import { PlaylistContext } from "../../../Contexts/PlaylistContext";
import { SongObject, SongsContext } from "../../../Contexts/SongsContext";
import { SortedSongsContext } from "../../../Contexts/SortedSongsContext";
import { SortingLockContext } from "../../../Contexts/SortingLockContext";
import ContextMenu from "../../context-menu/ContextMenu";
import { formatDateAdded, formatDuration } from "./../MusicTable";
import HighlightedText from "./../table-search/HighlightedText";
import "./MusicTableContent.scss";

const API_URL = "http://localhost:4000";

//TODO SWITCH FROM SORTED TO FILTERED SONGS FOR PLAYING
// TODO remove activeSong in favor of index setting.
// TODO (Possibly done, but address first.) remove currentPlaying state in favor of setActive if possible. May be unnecessary
// TODO disable highlighting on table cells
// TODO need to set playlist array instead of set active song. Can just send an array of songs PUT IMPLEMENTATION IN THIS COMPONENT
// TODO Instead of hierarchical storage of the database, songs can be in their own documents with a reference to the playlist to save on space

interface TableContentProps {
  entries: SongObject[];
  columns: { Header: string; accessor: string }[];
  searchQuery: string;
  sortingOrder: string;
  clickedHeader: string | null;
}

const MusicTableContent: React.FC<TableContentProps> = ({entries,columns,searchQuery,sortingOrder,clickedHeader}) => {
  // Context hooks
  const { activeSong, setActiveSong } = useContext(PlayerContext);
  const { sortedSongs, setSortedSongs } = useContext(SortedSongsContext);
  const { currentSongIndex, setCurrentSongIndex } = useContext(IndexContext);
  const { isPlaying, setIsPlaying } = useContext(PlayingContext);
  const { sortingLock, setSortingLock } = useContext(SortingLockContext);
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Define a function to open the context menu at a specific position
  const openContextMenu = (x: number, y: number) => {
    setContextMenuPosition({ x, y });
  };

  // Define a function to close the context menu
  const closeContextMenu = () => {
    setContextMenuPosition(null);
  };
  //-------------

  // Use useEffect to load sortingLock from localStorage
  useEffect(() => {
    const savedSortOrder = localStorage.getItem("sortOrder");
    if (savedSortOrder) {
      console.log("sort order found in local storage:", savedSortOrder);
      setSortingLock(savedSortOrder);
    }
  }, []);
  //--------------

  // Local states
  const [currentPlaying, setCurrentPlaying] = useState<string[]>([]);
  const [selectedRow, setSelectedRow] = useState<string[]>([]); // console.log("TABLE CONTENT ORDER:", sortingOrder);

  // Handle sorting based on sortingOrder
  const sortedEntries = [...entries];

  sortedEntries.sort((a, b) => {
    if (sortingOrder === "asc" && clickedHeader) {
      if (a[clickedHeader] < b[clickedHeader]) return -1;
      if (a[clickedHeader] > b[clickedHeader]) return 1;
      return 0;
    } else if (sortingOrder === "desc" && clickedHeader) {
      if (a[clickedHeader] > b[clickedHeader]) return -1;
      if (a[clickedHeader] < b[clickedHeader]) return 1;
      return 0;
    }

    // Default return value if sortingOrder is neither "asc" nor "desc" or clickedHeader is "unsorted"
    return 0;
  });

  //TODO go through and see which states are not needed
  // Sets various states when selecting a song to play. The states are used in MusicController.
  const handlePlay = (fileName: string, index: number) => {
    if (!currentPlaying.includes(fileName)) {
      setActiveSong(`${API_URL}/uploads/${fileName}`); //context but may be removable
      setIsPlaying(true); //context
      setSortingLock(sortingOrder); //can probably remove if I don't use for persistent sorting.
      setCurrentPlaying([fileName]);
      setSortedSongs(sortedEntries); //fixed playlists not being updated with sorted entries
      setCurrentSongIndex(index);
    } else {
      // Clicked on the same row
      setActiveSong(``); //context but may be removable
      setCurrentSongIndex(Number.MIN_VALUE);
      // Delay the state change to ensure it updates correctly
      setTimeout(() => {
        setActiveSong(`${API_URL}/uploads/${fileName}`); //context but may be removable
        setCurrentSongIndex(index);
      }, 20);
    }
  };

  const handleSelect = (songId: string) => {
    if (selectedRow.includes(songId)) {
      setSelectedRow(selectedRow.filter((id) => id !== songId));
    } else {
      setSelectedRow([songId]);
    }
  };

  const getRowClassName = (fileName: string, songId: string) => {
    const activeSongFileName =
      activeSong && activeSong.replace(`${API_URL}/uploads/`, "");

    if (activeSongFileName === fileName && selectedRow.includes(songId)) {
      return "playing-selected";
    } else if (activeSongFileName === fileName) {
      return "playing";
    } else if (selectedRow.includes(songId)) {
      return "selected";
    } else {
      return "";
    }
  };

  return (
    <tbody>
      {sortedEntries.map((entry, index) => {
        return (
          <tr
            onDoubleClick={() => handlePlay(entry.fileNameFormatted, index)}
            onClick={() => handleSelect(entry._id)}
            onContextMenu={(event) => {
              event.preventDefault();
              openContextMenu(event.clientX, event.clientY);
            }}
            key={entry._id}
            className={getRowClassName(entry.fileNameFormatted, entry._id)}
          >
            <td id="tableEntryIndex">{index + 1}</td>
            {columns.map((column) => (
              <td key={column.accessor} className="table-cell">
                {column.accessor === "title" ||
                column.accessor === "artist" ||
                column.accessor === "album" ? (
                  <HighlightedText
                    text={entry[column.accessor] || ""}
                    query={searchQuery}
                  />
                ) : column.accessor === "duration" ? (
                  formatDuration(entry[column.accessor])
                ) : column.accessor === "image[0].imageBuffer" ? (
                  entry.image[0] && entry.image[0].imageBuffer ? (
                    <img
                      src={`data:${entry.image[0].mime};base64,${entry.image[0].imageBuffer}`}
                      alt="Song Image"
                      width="50"
                      height="50"
                    />
                  ) : (
                    "No Image"
                  )
                ) : column.accessor === "dateAdded" ? (
                  formatDateAdded(entry[column.accessor].toString())
                ) : (
                  entry[column.accessor] || "N/A"
                )}
              </td>
            ))}
          </tr>
        );
      })}

      {contextMenuPosition && (
        <ContextMenu
          x={contextMenuPosition.x}
          y={contextMenuPosition.y}
          closeContextMenu={closeContextMenu}
        />
      )}
    </tbody>
  );
};

export default MusicTableContent;
