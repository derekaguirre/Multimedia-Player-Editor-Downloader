import axios from "axios";
import { parseFile } from "music-metadata";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { inspect } from "util";

const API_URL = "http://localhost:4000";

interface FileObject {
  _id: string;
  fileNameOriginal: string;
  fileNameFormatted: string;
  filePath: string;
  fileSize: number;
  fileType: string;
}
interface SongObject {
  duration?: unknown; // New property for storing duration
  artist?: string; // New property for storing artist
  album: string; // New property for storing album
  albumCover?: unknown; // New property for storing album cover
}

const FileUploader: React.FC = () => {
  
  //Formatting names to be read by music player
  const nameFormatter = (str: string) => {
    return str.replace(/ /g, "%20").replace(",", "%2C");
  };
  
  //File importing logic
  const onDrop = async (acceptedFiles: File[]) => {
    try {
      //Retrieve the actual file
      const fileObj  = new FormData();
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

      
      //Post the metadata to mongo
      console.log("METADATA", metadataArray);
      await axios.post(`${API_URL}/files/new-metadata`, { metadataArray });
      console.log("File metadata stored successfully!");

      // Post the file (make a copy) to the uploads folder in the api
      const response = await axios.post(`${API_URL}/files/new`, fileObj);
      console.log("Files uploaded successfully!");
      console.log("Response:", response.data);

    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };
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
        <input type="file" name="uploadedFiles" multiple id="file" {...getInputProps()}/>
        <p>Drag and drop files here or click to select files</p>
      </div>
    </div>
  );
};

export default FileUploader;
