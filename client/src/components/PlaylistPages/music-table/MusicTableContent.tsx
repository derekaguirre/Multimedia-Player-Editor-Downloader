import axios from "axios";
import React, { MouseEvent, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { usePlaylist } from "../../PlaylistContext";
// import ContextMenu from "../context-menu/ContextMenu";
import { usePlayer } from "../../PlayerContext";
import { SongObject, SongsContext } from "./../../SongsContext";
import "./MusicTableContent.scss";
var counter = 0

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
// on playlist selection (implemented here but can move to sidebar now)
// adding songs DONE (implemented inside of PlaylistMain)

const MusicTableContent: React.FC<TableContentProps> = ({ entries, columns,}) => {
  // FOR UPCOMING EDITOR MODAL
  //https://www.youtube.com/watch?v=-yIsQPp31L0
  
  // Context hooks
  const { currentPlaylistId } = usePlaylist(); 
  // const {playingFile,setPlayingFile} = usePlayer();
  const [playingFile, setPlayingFile] = useState<string | null>(null);

  //Local states

  useEffect(() => {
    console.log("Rendering MusicTable");
  }, [currentPlaylistId]);

  const handlePlay = (file: string) => {
    console.log(counter++);

    console.log("Can file play?",ReactPlayer.canPlay(file),"\nAttempting to play:",file);
    
    setPlayingFile(file);
    console.log("testing file passed to player ",playingFile)
  };

  
  const SortArrow: React.FC<SortArrowProps> = ({ order }) => (
    <span>{order === "asc" ? "▲" : order === "desc" ? "▼" : ""}</span>
  );
  // {playingFile && (
  //   <div className="player-wrapper">
  //   </div>
  // )}

  // Loop through each entry in the 'entries' array create a table row with a unique key based on entry ID

  return (
    <tbody>
      {entries.map((entry) => (
        <tr key={entry._id}>
          {/* prettier-ignore */}
            <td id="playButtonEntry">
            <button onClick={() =>handlePlay(`${API_URL}/uploads/${entry.fileNameFormatted}`)}>Play</button>
            {playingFile && (
              <ReactPlayer
              className="react-player"
              url={playingFile}
              playing={true}
              volume={0.4}
              width="100%"
              height="100%"
              onError={(error) => {
                console.error("Error playing media:", error);
              }}
            />
            )}
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