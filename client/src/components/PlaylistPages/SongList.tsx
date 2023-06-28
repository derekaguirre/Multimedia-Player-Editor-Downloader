import axios, { AxiosResponse } from "axios";
import { parseFile } from 'music-metadata';
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";



const API_URL = "http://localhost:4000";

interface FileObject {
  _id: string;
  fileNameOriginal: string;
  fileNameFormatted: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  sortOrder?: "asc" | "desc";
}
interface SortArrowProps {
  order?: "asc" | "desc";
}

const PlaylistPage: React.FC = () => {
  const [songs, setSongs] = useState<FileObject[]>([]);
  const [playingFile, setPlayingFile] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof FileObject | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  

  useEffect(() => {
    fetchPlaylistData();
  }, []);

  const fetchPlaylistData = async () => {
    try {
      console.log("GET request happening at SongsList L37")
      const response: AxiosResponse<FileObject[]> = await axios.get(
        
        `${API_URL}/files`
      );
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

  const handleSort = (column: keyof FileObject) => {
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
    setSortDirection(
      sortColumn === column ? (sortDirection === "asc" ? "desc" : "asc") : "asc"
    );
  };

  return (
    <div>
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

      <div className="playlistTable">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("_id")}>
                FileID <SortArrow order={sortColumn === "_id" ? sortDirection : undefined} />
              </th>
              <th onClick={() => handleSort("fileNameOriginal")}>
                File Name <SortArrow order={sortColumn === "fileNameOriginal" ? sortDirection : undefined} />
              </th>
              <th onClick={() => handleSort("filePath")}>
                File Path <SortArrow order={sortColumn === "filePath" ? sortDirection : undefined} />
              </th>
              <th onClick={() => handleSort("fileSize")}>
                File Size <SortArrow order={sortColumn === "fileSize" ? sortDirection : undefined} />
              </th>
              <th onClick={() => handleSort("fileType")}>
                File Type <SortArrow order={sortColumn === "fileType" ? sortDirection : undefined} />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {songs.map((file) => (
              <tr key={file._id}>
                <td>{file._id}</td>
                <td>{file.fileNameOriginal}</td>
                <td>{file.filePath}</td>
                <td>{file.fileSize}</td>
                <td>{file.fileType}</td>
                <td id="playButtonEntry">
                  <button
                    onClick={() => handlePlay(`${API_URL}/uploads/${file.fileNameFormatted}`)}
                  >
                    Play
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlaylistPage;