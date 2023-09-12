import axios from "axios";
import React, { MouseEvent, useEffect, useState } from "react";
import { usePlaylist } from "../../PlaylistContext";
// import ContextMenu from "../context-menu/ContextMenu";
import { usePlayer } from "../../PlayerContext";
import { SongObject, SongsContext } from "./../../SongsContext";
import "./MusicTableContent.scss";
import Player from "./Player";
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
  // const {playingFile,setPlayingFile} = usePlayer();
  // const [playingFile, setPlayingFile] = useState<string | null>(null);
  const [activeSong, setActiveSong] = useState<string | null>(null);

  //Local states

  // useEffect(() => {

  // }, []);
  console.log("TABLE CONTENT RENDERED");
  //   const handlePlay = () => {
  //     // console.log("Can file play?",ReactPlayer.canPlay(file),"\nAttempting to play:",file);
  // // console.log()
  //     setIsPlaying((prevState) => !prevState); // Toggle play/pause state
  //     // console.log("testing file passed to player ",playingFile)
  //     return
  //   };
  const handlePlay = (file: string) => {
    
    setActiveSong(file); // Set the file to play globally
  };

  // const SortArrow: React.FC<SortArrowProps> = ({ order }) => (
  //   <span>{order === "asc" ? "▲" : order === "desc" ? "▼" : ""}</span>
  // );
  // {playingFile && (
  //   <div className="player-wrapper">
  //   </div>
  // )}

  // Loop through each entry in the 'entries' array create a table row with a unique key based on entry ID
  console.log("TABLE CONTENT RENDERED");

  return (
    <tbody>
      {entries.map((entry) => (
        <tr key={entry._id}>
          {/* prettier-ignore */}
          <td id="playButtonEntry">
            <button onClick={() =>handlePlay(`${API_URL}/uploads/${entry.fileNameFormatted}`)}>Play</button>
            {/* <Player playing={isPlaying} currentSong = {`${API_URL}/uploads/${entry.fileNameFormatted}`} /> */}
            <Player playing={activeSong === `${API_URL}/uploads/${entry.fileNameFormatted}`} currentSong={`${API_URL}/uploads/${entry.fileNameFormatted}`} />
          </td>
          {columns.map((column) => (
            <td key={column.accessor} className="table-cell">
              {entry[column.accessor] || "N/A"}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default MusicTableContent;
