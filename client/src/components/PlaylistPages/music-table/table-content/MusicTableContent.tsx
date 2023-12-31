import React, { useCallback, useContext, useEffect, useState } from "react";
import ContextMenu from "../../../ContextMenus/song-menu/SongContextMenu";
import { IndexContext } from "../../../StateContexts/IndexContext";
import { PlayerContext } from "../../../StateContexts/PlayerContext";
import { PlayingContext } from "../../../StateContexts/PlayingContext";
import { SongObject } from "../../../StateContexts/SongsContext";
import { SortedSongsContext } from "../../../StateContexts/SortedSongsContext";
import { SortingLockContext } from "../../../StateContexts/SortingLockContext";
import { formatDateAdded, formatDuration } from "./../MusicTable";
import HighlightedText from "./../table-search/HighlightedText";
import "./MusicTableContent.scss";

const API_URL = "http://localhost:4000";

// TODO remove activeSong in favor of index setting.
// TODO (Possibly done, but address first.) remove currentPlaying state in favor of setActive if possible. May be unnecessary
// TODO Instead of hierarchical storage of the database, songs can be in their own documents with a reference to the playlist to save on space

interface TableContentProps {
  entries: SongObject[];
  columns: { Header: string; accessor: string }[];
  searchQuery: string;
  sortingOrder: string;
  clickedHeader: string | null;
}

const MusicTableContent: React.FC<TableContentProps> = ({
  entries,
  columns,
  searchQuery,
  sortingOrder,
  clickedHeader,
}) => {
  //Local States
  const [currentPlaying, setCurrentPlaying] = useState<string[]>([]);
  const [selectedRow, setSelectedRow] = useState<string[]>([]);
  const [songData, setSongData] = useState<SongObject>();

  // console.log("TABLE CONTENT ORDER:", sortingOrder);

  // Context hooks
  const { activeSong, setActiveSong, setActiveSongId } =
    useContext(PlayerContext);
  const { setSortedSongs } = useContext(SortedSongsContext);
  const { setCurrentSongIndex } = useContext(IndexContext);
  const { setIsPlaying } = useContext(PlayingContext);
  const { setSortingLock } = useContext(SortingLockContext);
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Memoized function which handles the opening of the the context menu at a specified position
  const openContextMenu = useCallback(
    (x: number, y: number, songId: string, songData: SongObject) => {
      setContextMenuPosition({ x, y });
      setActiveSongId(songId);
      setSongData(songData);
    },
    []
  );

  //prettier-ignore
  const handleContextMenu = useCallback((event: React.MouseEvent, songId: string, songData:  SongObject) => {
      openContextMenu(event.clientX, event.clientY, songId, songData);
    },
    [openContextMenu]
  );

  // Define a function to close the context menu
  const closeContextMenu = () => {
    setContextMenuPosition(null);
  };
  //-------------

  //TODO Update frontend to use the sort order from local storage. (Persist the sorting)
  // Use useEffect to load sortingLock from localStorage
  useEffect(() => {
    const savedSortOrder = localStorage.getItem("sortOrder");
    if (savedSortOrder) {
      console.log("sort order found in local storage:", savedSortOrder);
      setSortingLock(savedSortOrder);
    }
  }, []);
  //--------------

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

  //TODO verify which states are needed
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
    <>
      <tbody>
        {sortedEntries.map((entry, index) => {
          return (
            <tr
              onDoubleClick={() => handlePlay(entry.fileNameFormatted, index)}
              onClick={() => handleSelect(entry._id)}
              onContextMenu={(event) =>
                handleContextMenu(event, entry._id, entry)
              }
              key={entry._id}
              className={getRowClassName(entry.fileNameFormatted, entry._id)}
            >
              <td id="tableEntryIndex">{index + 1}</td>
              <td className="table-cell">
                <div className="songEntryPrimaryInfoContainer">
                  <div className="songEntryPic">
                    <img
                      src={`data:${entry.image[0].mime};base64,${entry.image[0].imageBuffer}`}
                      alt={`${entry.title} Image`}
                      width="40"
                      height="40"
                    />
                  </div>
                  <div className="songEntryTitleArtistContainer">
                    <div className="songEntryTitle">
                      <HighlightedText
                        text={entry.title || ""}
                        query={searchQuery}
                      />
                    </div>
                    <div className="songEntryArtist">
                      <HighlightedText
                        text={entry.artist || ""}
                        query={searchQuery}
                      />
                    </div>
                  </div>
                </div>
              </td>
              <td className="table-cell">
                <HighlightedText text={entry.album || ""} query={searchQuery} />
              </td>
              <td className="table-cell" >
                {formatDateAdded(entry.dateAdded.toString())}
              </td>
              <td className="table-cell">{formatDuration(entry.duration) }</td>
            </tr>
          );
        })}

        {contextMenuPosition && songData && (
          <ContextMenu
            x={contextMenuPosition.x}
            y={contextMenuPosition.y}
            closeContextMenu={closeContextMenu}
            songData={songData}
          />
        )}
      </tbody>
    </>
  );
};

export default MusicTableContent;
