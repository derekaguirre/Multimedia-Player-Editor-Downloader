import axios from "axios";
import React, { MouseEvent, useContext, useEffect, useState } from "react";
import { usePlaylist } from "../../../PlaylistContext";
// import ContextMenu from "../context-menu/ContextMenu";
import { PlayerContext } from "../../../PlayerContext";
import Player from "../../music-controller/Player";
import { SongObject, SongsContext } from "./../../../SongsContext";
import "./MusicTableContent.scss";
var counter = 0;

const API_URL = "http://localhost:4000";

//Defining all the information stored in DB for reference

interface TableContentProps {
  entries: SongObject[];
  columns: { Header: string; accessor: string }[];
}

//Migrate fetch to own file and invoke at:
// startup TODO
// on playlist selection (implemented here but can move to sidebar now)
// adding songs DONE (implemented inside of PlaylistMain)

const MusicTableContent: React.FC<TableContentProps> = ({
  entries,
  columns,
}) => {
  // FOR UPCOMING EDITOR MODAL
  //https://www.youtube.com/watch?v=-yIsQPp31L0

  // Context hooks
  const { currentPlaylistId } = usePlaylist();

  //Local states

  useEffect(() => {
    //Set PLAYLIST ARRAY here**** full playlist fill is fine for now. will optimize with smaller playlist sample size
    console.log("TABLE CONTENT RENDERED");
  }, []);

  // const SortArrow: React.FC<SortArrowProps> = ({ order }) => (
  //   <span>{order === "asc" ? "▲" : order === "desc" ? "▼" : ""}</span>
  // );
  // {playingFile && (
  //   <div className="player-wrapper">
  //   </div>
  // )}
  const { setActiveSong } = useContext(PlayerContext);

  const handlePlay = (file: string) => {
    //TODO SET A PLAYLIST, not the current song. since the player can accept string[]
    setActiveSong(`${API_URL}/uploads/${file}`);
    
  };

  // Loop through each entry in the 'entries' array create a table row with a unique key based on entry ID
  console.log("TABLE CONTENT RENDERED");

  return (
    <tbody>
      {entries.map((entry) => (
        <tr onDoubleClick={() =>handlePlay(entry.fileNameFormatted)} key={entry._id}>
          {/* prettier-ignore */}
          <td id="playButtonEntry">
            {/* TODO set a state and pass it to context for use in MusicController.tsx*/}
            {/* <button>Play</button> */}
            {/* <Player playing={isPlaying} currentSong = {`${API_URL}/uploads/${entry.fileNameFormatted}`} /> */}
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
