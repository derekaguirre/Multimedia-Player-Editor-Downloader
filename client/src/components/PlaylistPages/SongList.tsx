import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player/";

const API_URL = "http://localhost:4000";

interface FileObject {
  _id: string;
  fileNameOriginal: string;
  fileNameFormatted: string;
  filePath: string;
  fileSize: number;
  fileType: string;
}


const PlaylistPage = () => {
  //Set up the states for retrieving and playing songs
  const [songs, setSongs] = useState<FileObject[]>([]);
  const [playingFile, setPlayingFile] = useState<string | null>(null);

  useEffect(() => {
    fetchPlaylistData();
  }, []);

  const fetchPlaylistData = async () => {
    try {
      const response: AxiosResponse<FileObject[]> = await axios.get(`${API_URL}/files`);
      setSongs(response.data);
    } catch (error) {
      console.error("Error fetching playlist data:", error);
    }
  };

  //Pass the formatted file path through here
  const handlePlay = (file: string) => {
    console.log("Can file play? ", ReactPlayer.canPlay(file));
    console.log("Attempting to play: ", file);
    setPlayingFile(file);
  };

  //antd
  //react-player
  return (
    <div>
      <h1>Playlist</h1>
      <div className ="filePlayer">
        {playingFile && (<ReactPlayer url={playingFile} playing={true} controls={true} width="100%"height="100px"/>)}
      </div>

      <div className= "playlistTable" data-scroll="0">
        <table>
          <thead>
            <tr>
              <th>FileID</th>
              <th>File Name</th>
              <th>File Path</th>
              <th>File Size</th>
              <th>File Type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {songs.map((file) => (
              <tr key={file._id}>
                <td>{file._id} </td>
                <td>{file.fileNameOriginal}</td>
                <td>{file.filePath}</td>
                <td>{file.fileSize}</td>
                <td>{file.fileType}</td>
                <td id="playButtonEntry">
                  <button onClick={() => handlePlay(`${API_URL}/uploads/${file.fileNameFormatted}`) }>
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
