import axios from "axios";
import React from "react";
import { useDropzone } from "react-dropzone";
import './FileUploader.scss';

//TODO remove use of playlist ID
//TODO make env file with API URL
//TODO use component in settings
//TODO if possible, wrap functionality around MusicTable

const API_URL = "http://localhost:4000";
const playlistId = "64e57f4ca023540bb2cad9de";

  // DATA FORMATTING METHODS--------------------------------------------
  //Formatting names to be read by music player
  const nameFormatter = (str: string) => {
    return str.replace(/ /g, "%20").replace(",", "%2C");
  };
  //Formatting for song titles
  const fileExtensionRemover = (str: string) => {
    return str.replace(".mp3", "");
  };


  // BACKEND INTERFACING--------------------------------------------
const FileUploader: React.FC = () => {
  //File importing logic
  const onDrop = async (acceptedFiles: File[]) => {
    try {
      //Retrieve the actual file
      const fileObj = new FormData();
      acceptedFiles.forEach((file) => {
        fileObj.append("uploadedFiles", file);
      });

      //Retrieve the metadata of the file, this will be sent to the server so data here must be fully pre-processed
      const metadataArray = acceptedFiles.map((file) => ({
        fileNameOriginal: file.name,
        fileNameFormatted: nameFormatter(file.name),
        filePath: file.webkitRelativePath,
        fileSize: file.size,
        fileType: file.type,
        title: fileExtensionRemover(file.name),
      }));

      // Post the file (make a copy) to the uploads folder in the api
      await axios.post(`${API_URL}/playlist/new-file`, fileObj);
      console.log("File(s) uploaded successfully!");

      //Post the metadata to mongo
      console.log("METADATA FROM FRONT END", metadataArray);
      await axios.post(`${API_URL}/playlist/${playlistId}/add-songs`, { metadataArray });
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
    <div >
      {/* prettier-ignore */}
      <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
        {/* prettier-ignore */}
        <input type="file" name="uploadedFiles" multiple id="file" {...getInputProps()}/>
        <h2>Drag and drop files here or click to select files</h2>
      </div>
    </div>
  );
};

export default FileUploader;
