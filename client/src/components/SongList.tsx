import axios from "axios";
import React, { useEffect, useState } from "react";
const API_URL = "http://localhost:4000";

interface FileObject {
  _id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
}

const PlaylistPage = () => {
  const [playlist, setPlaylist] = useState<FileObject[]>([]);

  useEffect(() => {
    fetchPlaylistData();
  }, []);

  const fetchPlaylistData = async () => {
    try {
      const response = await axios.get(`${API_URL}/files`); // Replace with your API endpoint
      setPlaylist(response.data);
    } catch (error) {
      console.error("Error fetching playlist data:", error);
    }
  };

  //might only just need the path
  const handlePlay = (file: string) => {
    // Logic to handle the play action for the selected file
    console.log("Play:", file);
  };

  //antd
  //react-player
  return (
    <div>
      <h1>Playlist</h1>

      <div>
        <table>
          <tr>
            <thead>
              <th>FileID</th>
              <th>File Name</th>
              <th>File Path</th>
              <th>File Size</th>
              <th>File Type</th>
            </thead>
          </tr>
          <tr>
            <tbody>
              {playlist.map((file) => (
                <tr key={file._id}>
                  <td>{file._id} </td>
                  <td>{file.fileName}</td>
                  <td>{file.filePath}</td>
                  <td>{file.fileSize}</td>
                  <td>{file.fileType}</td>
                  <button onClick={() => handlePlay(file.filePath)}>
                    Play
                  </button>
                </tr>
              ))}
            </tbody>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default PlaylistPage;
