import axios from "axios";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "./FileUploader.scss";

// TODO: Remove use of playlist ID
// TODO: Make env file with API URL
// TODO: Use component in settings
// TODO: If possible, wrap functionality around MusicTable

const API_URL = "http://localhost:4000";
const playlistId = "64e57f4ca023540bb2cad9de";

// DATA FORMATTING METHODS--------------------------------------------
// Formatting names to be read by the music player
const nameFormatter = (str: string) => {
  return str.replace(/ /g, "%20").replace(",", "%2C");
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
  const [metadataArray, setMetadataArray] = useState<
    Array<{
      fileNameOriginal: string;
      fileNameFormatted: string;
      fileSize: number;
      fileType: string;
      duration: number | undefined;
      title: string;
    }>
  >([]);

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
      
      // Update the state with the new metadataArray
      setMetadataArray(updatedMetadataArray);

      // Post the file (make a copy) to the uploads folder in the api
      await axios.post(`${API_URL}/playlist/new-file`, fileObj);
      console.log("File(s) uploaded successfully!");

      // Post the metadata to mongo
      console.log("METADATA FROM FRONT END", updatedMetadataArray);
      await axios.post(`${API_URL}/playlist/${playlistId}/add-songs`, { metadataArray: updatedMetadataArray });
      console.log("File metadata stored successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  // IMPORTING--------------------------------------------
  
  //Properties for file importing
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [],
      "video/*": [],
    },
  });

  return (
    <div>
      {/* prettier-ignore */}
      <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
        {/* prettier-ignore */}
        <input type="file" name="uploadedFiles" multiple id="file" {...getInputProps()} />
        <h2>Drag and drop files here or click to select files</h2>
      </div>
    </div>
  );
};

export default FileUploader;
