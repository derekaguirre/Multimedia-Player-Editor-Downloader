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
  duration?: number; // New property for storing duration
  artist?: string; // New property for storing artist
  album?: string; // New property for storing album
  albumCover?: string; // New property for storing album cover
}

const FilePicker: React.FC = () => {
  const [files, setFiles] = useState<FileObject[]>([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get<FileObject[]>(`${API_URL}/files`);
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  //string replace for the name
  const nameFormatter = (str: string) => {
    str = str.replace(/ /g, "%20");
    str = str.replace(",", "%2C");
    return str;
  };
  //Adds the metadata of a song into the database
  const uploadFileMetadata = async (fileData: File[]) => {
    try {
      const metadataArray = fileData.map((file) => ({
        fileNameOriginal: file.name,
        fileNameFormatted: nameFormatter(file.name),
        filePath: file.webkitRelativePath,
        fileSize: file.size,
        fileType: file.type,
      }));

      console.log("METADATA", metadataArray);
      await axios.post(`${API_URL}/files/new-metadata`, { metadataArray });
      console.log("File metadata stored successfully!");
    } catch (error) {
      console.error("Error storing file metadata:", error);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    try {
      // Upload file metadata
      uploadFileMetadata(acceptedFiles);

      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append("uploadedFiles", file);
      });

      const response = await axios.post(`${API_URL}/files/new`, formData);
      console.log("Files uploaded successfully!");
      console.log("Response:", response.data);
      fetchFiles();
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [],
      "video/*": [],
    },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
      >
        <input
          type="file"
          name="uploadedFiles"
          multiple
          id="file"
          {...getInputProps()}
        />
        <p>Drag and drop files here or click to select files</p>
      </div>
    </div>
  );
};

export default FilePicker;
