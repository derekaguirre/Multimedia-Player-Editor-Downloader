import axios from "axios";
import React, { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PlaylistContext } from "../../PlaylistContext";
import "./FileUploader.scss";

// TODO: Make env file with API URL
// TODO: Use component in settings
// TODO: If possible, wrap functionality around MusicTable

const API_URL = "http://localhost:4000";

// -------------------------------DATA FORMATTING METHODS-------------------------------
// Formatting names to be read by the music player
const nameFormatter = (str: string) => {
  return encodeURIComponent(str);
};

// Formatting for song titles
const fileExtensionRemover = (str: string) => {
  return str.replace(".mp3", "");
};

// Function to get the duration of an audio file
const getAudioDuration = async (file: File) => {
  return new Promise<number | undefined>((resolve) => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };
    audio.src = URL.createObjectURL(file);
  });
};

const FileUploader: React.FC = () => {
  //Context States
  const { currentPlaylistId} = useContext(PlaylistContext);

  const onDrop = async (acceptedFiles: File[]) => {
    try {
      // Retrieve the actual file
      const fileObj = new FormData();
      acceptedFiles.forEach((file: File) => {
        fileObj.append("uploadedFiles", file);
      });

      // Retrieve the metadata of the file, this will be sent to the server so data here must be fully pre-processed
      const updatedMetadataArray = await Promise.all(acceptedFiles.map(async (file: File) => {
        // Add type annotation for 'file'
        const duration = await getAudioDuration(file); 
        return {
          fileNameOriginal: file.name,
          fileNameFormatted: nameFormatter(file.name),
          fileSize: file.size,
          fileType: file.type,
          duration: duration,
          title: fileExtensionRemover(file.name),
        };
      }));
      
      // Post the file (make a copy) to the uploads folder in the api
      await axios.post(`${API_URL}/playlist/new-file`, fileObj);
      console.log("File(s) uploaded successfully!");

      // Post the metadata to mongo
      console.log("METADATA FROM FRONT END", updatedMetadataArray);
      await axios.post(`${API_URL}/playlist/${currentPlaylistId}/add-songs`, { metadataArray: updatedMetadataArray });
      console.log("File metadata stored successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  // IMPORTING--------------------------------------------
  console.log("Rendered FileUploader")
  //Properties for file importing
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [],
      "video/*": [],
    },
  });

  return (
    <div className = "uploadArea">
      {/* prettier-ignore */}
      <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
        {/* prettier-ignore */}
        <input type="file" name="uploadedFiles" multiple id="file" {...getInputProps()} />
        <h2>Upload Files</h2>
      </div>
    </div>
  );
};

export default FileUploader;
