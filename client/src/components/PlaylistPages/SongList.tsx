import axios, { AxiosResponse } from "axios";
import { MouseEvent } from "react";

import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import ContextMenu from "./ContextMenu/ContextMenu";

const API_URL = "http://localhost:4000";
const playlistId = "649d5278681cd4a4ad3a1645";

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
interface SortArrowProps {
  order?: "asc" | "desc";
}
const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
};

const PlaylistPage: React.FC = () => {
  //Local states
  const [songs, setSongs] = useState<SongObject[]>([]);
  const [playingFile, setPlayingFile] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof SongObject | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  //Coordinate States
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState(initialContextMenu);

  useEffect(() => {
    fetchPlaylistData(playlistId);
  }, []);

  const fetchPlaylistData = async (playlistId: string) => {
    try {
      // prettier-ignore
      const response = await axios.get(`${API_URL}/playlist/${playlistId}/songs`);
      console.log("FRONTEND METADATA: ", response.data);
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
  const contextMenuClose = () => setContextMenu(initialContextMenu)

  return (
    <div>
      {contextMenu.show && <ContextMenu x = {contextMenu.x} y={contextMenu.y} closeContextMenu={contextMenuClose}/>}

      <h1>Playlist</h1>
      <div className="filePlayer">
        {playingFile && (
          <ReactPlayer
            url={playingFile}
            playing
            controls
            width="100%"
            height="100px"
          />
        )}
      </div>

      <div
        className="playlistTable"
        onContextMenu={(e) => {
          handleContextMenu(e);
        }}
      >
        <table>
          <thead>
            {/* prettier-ignore */}
            <tr>
              <th onClick={() => handleSort("_id")}>
                FileID{" "}
                <SortArrow order={sortColumn === "_id" ? sortDirection : undefined}/>
              </th>
              <th onClick={() => handleSort("fileNameOriginal")}>
                File Name{" "}
                <SortArrow order={sortColumn === "fileNameOriginal" ? sortDirection : undefined}/>
              </th>
              <th onClick={() => handleSort("filePath")}>
                File Path{" "}
                <SortArrow order={sortColumn === "filePath" ? sortDirection : undefined}/>
              </th>
              <th onClick={() => handleSort("fileSize")}>
                File Size{" "}
                <SortArrow order={sortColumn === "fileSize" ? sortDirection : undefined}/>
              </th>
              <th onClick={() => handleSort("fileType")}>
                File Type{" "}
                <SortArrow order={sortColumn === "fileType" ? sortDirection : undefined}/>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {songs && songs.length > 0 ? (
              songs.map((file) => (
                <tr key={file._id}>
                  <td>{file._id}</td>
                  <td>{file.fileNameOriginal}</td>
                  <td>{file.filePath}</td>
                  <td>{file.fileSize}</td>
                  <td>{file.fileType}</td>
                  <td id="playButtonEntry">
                    {/* prettier-ignore */}
                    <button onClick={() => handlePlay(`${API_URL}/uploads/${file.fileNameFormatted}` ) }>
                      Play
                    </button>
                  </td>
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

export default PlaylistPage;
