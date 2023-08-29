import axios from "axios";
import React from "react";
import { useDropzone } from "react-dropzone";
import './FileUploader.scss';


const API_URL = "http://localhost:4000";
const playlistId = "649d7447e7a0d197e0bb6d3c";

  // BACKEND INTERFACING--------------------------------------------


const FileUploader: React.FC = () => {
  //Formatting names to be read by music player
  const nameFormatter = (str: string) => {
    return str.replace(/ /g, "%20").replace(",", "%2C");
  };

  //File importing logic
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
