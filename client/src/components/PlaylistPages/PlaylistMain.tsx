import axios from "axios";
import React, { useEffect } from "react";
import { usePlaylist } from "../PlaylistContext";
import { useSongs } from "../SongsContext";
import "./PlaylistMain.scss";
import FileUploader from "./file-uploader/FileUploader";
import MusicTable from "./music-table/MusicTable";

const API_URL = "http://localhost:4000";
//TODO Remove honeycore from localstorage
//TODO if no playlist ID exists, create one
//can be achieved by checking local storage if playlistID is populated
//set state to conditionally render an EmptyPlaylist component that prompts you to create a playlist
//consider api call to create an empty playlist with a default name "New Playlist"

//File uploader will be used again inside of settings with more visible usage i.e. button and dragging.
const PlaylistMain: React.FC = () => {
  //Context hooks
  const { currentPlaylistId, currentPlaylistName } = usePlaylist();
  const { setSongs } = useSongs();

  //Formatting names to be read by music player
  const nameFormatter = (str: string) => {
    return str.replace(/ /g, "%20").replace(",", "%2C");
  };
  // IMPORTING--------------------------------------------
  //TODO REFACTOR File importing logic
  const onDrop = async (acceptedFiles: File[]) => {
    try {
      //Retrieve the actual file
      const fileObj = new FormData();
      acceptedFiles.forEach((file) => {
        fileObj.append("uploadedFiles", file);
      });

      //Retrieve the metadata of the file
      const metadataArray = acceptedFiles.map((file) => ({
        fileNameOriginal: file.name,
        fileNameFormatted: nameFormatter(file.name),
        filePath: file.webkitRelativePath,
        fileSize: file.size,
        fileType: file.type,
      }));

      // Post the file (make a copy) to the uploads folder in the api
      await axios.post(`${API_URL}/playlist/new-file`, fileObj);
      console.log("File(s) uploaded successfully!");

      //Post the metadata to mongo
      console.log("METADATA FROM FRONT END", metadataArray);
      await axios.post(`${API_URL}/playlist/${currentPlaylistId}/add-songs`, {
        metadataArray,
      });

      //Update table state w/ backend
      //TODO fetch takes way too long, find another way to update the state, possible size check for state update
      const fetchedSongs = await axios.get(`${API_URL}/playlist/${currentPlaylistId}/songs`);
      setSongs(fetchedSongs.data); // Pass the updated songs array

      console.log("File metadata stored successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };
  //Properties for file importing
  // const { getRootProps, isDragActive } = useDropzone({
  //   onDrop,
  //   noClick: true,
  //   accept: {
  //     "audio/*": [],
  //     "video/*": [],
  //   },
  // });
  // console.log("PLAYLISTMAIN RENDERED");

  return (
    // {...getRootProps()}
    <div className="PlaylistMain">
      {/* prettier-ignore */}
      {/* <div  className={`dropzone ${isDragActive ? "active" : ""}`}> */}
      {/* <FileUploader/> */}
      <div className="header">
        <h1>
          {currentPlaylistName}: {currentPlaylistId}
        </h1>
      </div>
      <div className="PlaylistTableContainer">
        {/* prettier-ignore */}
        {/* <input type="file" name="uploadedFiles" multiple id="file" {...getInputProps()}/> */}

        <MusicTable currentPlaylistId={currentPlaylistId} />
      </div>
    </div>
    // </div>
  );
};

export default PlaylistMain;
