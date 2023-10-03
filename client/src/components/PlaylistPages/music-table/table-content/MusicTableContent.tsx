import React, { useContext, useEffect, useState } from "react";
import { IndexContext } from "../../../IndexContext";
import { PlayerContext } from "../../../PlayerContext";
import { PlayingContext } from "../../../PlayingContext";
import { SortedSongsContext } from "../../../SortedSongsContext";
import { SongObject, SongsContext } from "./../../../SongsContext";
import { formatDateAdded, formatDuration } from "./../MusicTable";
import HighlightedText from "./../table-search/HighlightedText";
import "./MusicTableContent.scss";

const API_URL = "http://localhost:4000";

// TODO remove activeSong in favor of index setting.
// TODO (Possibly done, but address first.) remove currentPlaying state in favor of setActive if possible. May be unnecessary
// TODO disable highlighting on talble cells
// TODO need to set playlist array instead of set active song. Can just send an array of songs PUT IMPLEMENTATION IN THIS COMPONENT

interface TableContentProps {
  entries: SongObject[];
  columns: { Header: string; accessor: string }[];
  searchQuery: string;
  sortingOrder: string;
  clickedHeader: string | null;
}

const MusicTableContent: React.FC<TableContentProps> = ({ entries, columns, searchQuery, sortingOrder, clickedHeader}) => {
  // Context hooks
  const { activeSong, setActiveSong } = useContext(PlayerContext);
  // const { sortedSongs, setSortedSongs } = useContext(SortedSongsContext);
  const {currentSongIndex, setCurrentSongIndex} = useContext(IndexContext);
  const { isPlaying, setIsPlaying } = useContext(PlayingContext);


  // Local states
  const [currentPlaying, setCurrentPlaying] = useState<string[]>([]);
  const [selectedRow, setSelectedRow] = useState<string[]>([]);
  
  // console.log("TABLE CONTENT ORDER:", sortingOrder);
  // console.log("STARTING INDEX: ", currentSongIndex);

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

    // Default return value if sortingOrder is neither "asc" nor "desc" or clickedHeader is null
    return 0;
  });

  //  If the row is not currently playing, set the active song to the current row
  const handlePlay = (fileName: string, index: number) => {
    if (!currentPlaying.includes(fileName)) {
      setActiveSong(`${API_URL}/uploads/${fileName}`); //context but may be removable
      setIsPlaying(true); //context
      setCurrentPlaying([fileName]);
      setCurrentSongIndex(index);
    } else {
      // TODO reset song when double clicking on the current row
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
    const activeSongFileName = activeSong && activeSong.replace(`${API_URL}/uploads/`, '');
    
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
  // console.log("Songs in content:", songs);
  // console.log("SortedSongs in content:", sortedSongs);

  // prettier-ignore
  return (
    <tbody>
      {sortedEntries.map((entry, index) => (
        <tr
          onDoubleClick={() => handlePlay(entry.fileNameFormatted, index)}
          onClick={() => handleSelect(entry._id)}
          key={entry._id}
          className={getRowClassName(entry.fileNameFormatted, entry._id)}
        >
          <td id="tableEntryIndex">{index + 1}</td>
          {columns.map((column) => (
            <td key={column.accessor} className="table-cell">
              {column.accessor === "title" || column.accessor === "artist" || column.accessor === "album" ? 
              (<HighlightedText text={entry[column.accessor] || ""} query={searchQuery} />) : 
              column.accessor === "duration" ? (formatDuration(entry[column.accessor])) : 
              column.accessor === "dateAdded" ? (formatDateAdded(entry[column.accessor].toString())) :
              (entry[column.accessor] || "N/A")}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default MusicTableContent;
