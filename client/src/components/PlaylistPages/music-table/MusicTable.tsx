import axios from "axios";
import React, { MouseEvent, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import ContextMenu from "../context-menu/ContextMenu";
// import SearchBar from "../search-bar/SearchBar";
import "./MusicTable.scss";
const API_URL = "http://localhost:4000";

//Defining all the information stored in DB for reference
interface ImageTypeObject {
  imageId: number;
  imageName: string;
  _id: string;
}
interface ImageObject {
  mime: string;
  imageType: ImageTypeObject;
  imageDescription: string;
  imageBuffer: Buffer;
  _id: string;
}
interface SongObject {
  fileNameOriginal: string;
  fileNameFormatted: string;
  fileSize: number;
  fileType: string;
  filePath: string;
  dateAdded: Date;
  isVisible: boolean;
  isLiked: boolean;
  title: string;
  artist: string;
  album: string;
  genre: string;
  image: ImageObject;
  _id: string;
  sortOrder?: "asc" | "desc";
}
interface PlaylistObject {
  currentPlaylistId: string; // Define the prop
}
interface SortArrowProps {
  order?: "asc" | "desc";
}
const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
};

//Migrate fetch to own file and invoke at:
// startup
// playlist selection
// adding songs

const MusicTable: React.FC<PlaylistObject> = ({ currentPlaylistId }) => {
  //Local states
  const [songs, setSongs] = useState<SongObject[]>([]);
  const [playingFile, setPlayingFile] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof SongObject | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  //Coordinate States
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState(initialContextMenu);
  
  

  useEffect(() => {
    console.log("Current Playlist ID in MusicTable:", currentPlaylistId);
    fetchPlaylistData(currentPlaylistId); // Fetch songs when the playlist ID changes
  }, [currentPlaylistId]);

  const fetchPlaylistData = async (playlistId: string) => {
    try {
      // prettier-ignore
      const response = await axios.get(`${API_URL}/playlist/${playlistId}/songs`);
      
      console.log("Fetching all songs from playlist: ", response.data);
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
  const handleContextMenu = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) =>{
    e.preventDefault();
    const {pageX, pageY} = e
    setContextMenu({show: true, x: pageX, y: pageY})
  }
  const contextMenuClose = () => setContextMenu(initialContextMenu);

  return (
    
    <div className="tableElementContainer">
      {/* prettier-ignore */}
      {contextMenu.show && (<ContextMenu x={contextMenu.x} y={contextMenu.y} closeContextMenu={contextMenuClose}/>)}

      <div className="filePlayer">
        {/* prettier-ignore */}
        {playingFile && ( <ReactPlayer url={playingFile} playing controls width="100%" height="100px" />)}
      </div>
            
      {/* prettier-ignore */}
      <div className="playlistTable" onContextMenu={(e) => { handleContextMenu(e); }}
      >
        <table style={{ width: "100%" }}>
          <thead>
            {/* prettier-ignore */}
            <tr>
              <th></th>
              {/* <th onClick={() => handleSort("_id")}>File ID{" "}<SortArrow order={sortColumn === "_id" ? sortDirection : undefined}/></th> */}
              <th onClick={() => handleSort("fileNameOriginal")}>File Name{" "}<SortArrow order={sortColumn === "fileNameOriginal" ? sortDirection : undefined}/></th>
              <th onClick={() => handleSort("title")}>Title{" "}<SortArrow order={sortColumn === "title" ? sortDirection : undefined}/></th>
              <th onClick={() => handleSort("album")}>Album{" "}<SortArrow order={sortColumn === "album" ? sortDirection : undefined}/></th>
              <th onClick={() => handleSort("artist")}>Artist{" "}<SortArrow order={sortColumn === "artist" ? sortDirection : undefined}/></th>
              {/* TODO entry for date added */}
              {/* <th onClick={() => handleSort("filePath")}>File Path{" "}<SortArrow order={sortColumn === "filePath" ? sortDirection : undefined}/></th> */}
            </tr>
          </thead>
          <tbody>
            {songs && songs.length > 0 ? (
              songs.map((file) => (
                <tr key={file._id}>
                  <td id="playButtonEntry">
                    {/* prettier-ignore */}
                    <button onClick={() => handlePlay(`${API_URL}/uploads/${file.fileNameFormatted}` ) }>
                      Play
                    </button>
                  </td>
                  {/* <td>{file._id}</td> */}
                  <td>{file.fileNameOriginal}</td>
                  <td>{file.title}</td>
                  <td>{file.artist}</td>
                  <td>{file.album}</td>
                  {/* <td>{file.filePath}</td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>Loading songs...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MusicTable;
