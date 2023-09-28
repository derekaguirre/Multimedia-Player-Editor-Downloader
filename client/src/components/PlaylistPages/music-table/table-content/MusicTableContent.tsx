import axios from "axios";
import React, { MouseEvent, useContext, useEffect, useState } from "react";
import { usePlaylist } from "../../../PlaylistContext";
// import ContextMenu from "../context-menu/ContextMenu";
import { PlayerContext } from "../../../PlayerContext";
import { SongObject, SongsContext } from "./../../../SongsContext";
import "./MusicTableContent.scss";

const API_URL = "http://localhost:4000";

//TODO setActiveSong should set an array of song titles
//TODO implement shuffle functionality here or in MusicTable

interface TableContentProps {
  entries: SongObject[];
  columns: { Header: string; accessor: string }[];
}

//prettier-ignore
const MusicTableContent: React.FC<TableContentProps> = ({entries,columns,}) => {
  // Context hooks
  const { setActiveSong } = useContext(PlayerContext) 
  //Local states
  const [currentPlaying, setCurrentPlaying] = useState<string[]>([]);
  const [selectedRow, setSelectedRow] = useState<string[]>([]);
  
  useEffect(() => {
    //Set PLAYLIST ARRAY here**** a full playlist is fine for now. will optimize with smaller playlist sample size
    // console.log("TABLE CONTENT RENDERED");
  }, []);
  
  // FOR UPCOMING EDITOR MODAL
  //https://www.youtube.com/watch?v=-yIsQPp31L0

  
  //  If the row is not currently playing, set the active song to the current row 
const handlePlay = (fileName: string) => {
  if (!currentPlaying.includes(fileName)) {
    setActiveSong(`${API_URL}/uploads/${fileName}`);
    setCurrentPlaying([fileName]);
  } else {
    // TODO reset song when double clicking on current row
  }
};

  const handleSelect = (songId: string) => {
    if (selectedRow.includes(songId)) {
      setSelectedRow(selectedRow.filter((id) => id !== songId));
    } else {
      setSelectedRow([songId]);
    }
  };

  const getRowClassName = (fileName: string, songId:string) => {
    if (currentPlaying.includes(fileName) && selectedRow.includes(songId)) {
      return "playing-selected";
    } 
    else if (currentPlaying.includes(fileName)) {
      return "playing";
    } 
    else if (selectedRow.includes(songId)) {
      return "selected";
    } 
    else {
      return "";
    }
  };


  // Loop through each entry in the 'entries' array create a table row with a unique key based on entry ID
  return (
    <tbody>
      {entries.map((entry, index) => (
        <tr
        onDoubleClick={() =>handlePlay(entry.fileNameFormatted )} 
        onClick={() => handleSelect(entry._id)}
        key={entry._id}
        className={getRowClassName(entry.fileNameFormatted, entry._id)}
      >
          {/* prettier-ignore */}
          <td id="playButtonEntry">
            <button>Play</button>
          </td>
          {columns.map((column) => (
            <td  key={column.accessor} className="table-cell" >
              {entry[column.accessor] || "N/A"}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default MusicTableContent;

//Sorting

// const SortArrow: React.FC<SortArrowProps> = ({ order }) => (
//   <span>{order === "asc" ? "▲" : order === "desc" ? "▼" : ""}</span>
// );
// {playingFile && (
//   <div className="player-wrapper">
//   </div>
// )}
