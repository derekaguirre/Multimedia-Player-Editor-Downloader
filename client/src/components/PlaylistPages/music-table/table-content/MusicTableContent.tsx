import React, { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../../../PlayerContext";
import { SongObject, SongsContext } from "./../../../SongsContext";
import HighlightedText from "./../table-search/HighlightedText"; // Import the HighlightedText component
import "./MusicTableContent.scss";

const API_URL = "http://localhost:4000";

//TODO remove currentPlaying state in favor of setActive if possible. May be unnecessary
//TODO need to set playlist array instead of set active song. Can just send an array of songs PUT IMPLEMENTATION IN THIS COMPONENT

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
  // Context hooks
  const { setActiveSong } = useContext(PlayerContext);
  // Local states
  const [currentPlaying, setCurrentPlaying] = useState<string[]>([]);
  const [selectedRow, setSelectedRow] = useState<string[]>([]);

  console.log("TABLE CONTENT ORDER:", sortingOrder);
  // Handle sorting based on sortingOrder
  //----------------------------------------------------------------------------------------------------------------------------------

  const sortedEntries = [...entries];

  sortedEntries.sort((a, b) => {
    if (sortingOrder === "asc" && clickedHeader) {
      // Check if clickedHeader is not null before using it
      if (a[clickedHeader] < b[clickedHeader]) return -1;
      if (a[clickedHeader] > b[clickedHeader]) return 1;
      return 0;
    } else if (sortingOrder === "desc" && clickedHeader) {
      // Check if clickedHeader is not null before using it
      if (a[clickedHeader] > b[clickedHeader]) return -1;
      if (a[clickedHeader] < b[clickedHeader]) return 1;
      return 0;
    }

    // Default return value if sortingOrder is neither "asc" nor "desc" or clickedHeader is null
    return 0;
  });
  

  //  If the row is not currently playing, set the active song to the current row
  const handlePlay = (fileName: string) => {
    if (!currentPlaying.includes(fileName)) {
      setActiveSong(`${API_URL}/uploads/${fileName}`);
      setCurrentPlaying([fileName]);
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
    if (currentPlaying.includes(fileName) && selectedRow.includes(songId)) {
      return "playing-selected";
    } else if (currentPlaying.includes(fileName)) {
      return "playing";
    } else if (selectedRow.includes(songId)) {
      return "selected";
    } else {
      return "";
    }
  };

  // Loop through each entry in the 'entries' array create a table row with a unique key based on entry ID
  // prettier-ignore
  return (
    <tbody>
      {sortedEntries.map((entry, index) => (
        <tr
          onDoubleClick={() => handlePlay(entry.fileNameFormatted)}
          onClick={() => handleSelect(entry._id)}
          key={entry._id}
          className={getRowClassName(entry.fileNameFormatted, entry._id)}
        >
          <td id="tableEntryIndex">
            {index + 1}
          </td>
          {columns.map((column) => (
            <td key={column.accessor} className="table-cell">
              {column.accessor === "title" || column.accessor === "artist" || column.accessor === "album" ? (
                <HighlightedText text={entry[column.accessor] || ""} query={searchQuery} />
              ) : (
                entry[column.accessor] || "N/A"
              )}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default MusicTableContent;