import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const API_URL = "http://localhost:4000";

interface FileObject {
  _id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
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

  const uploadFileMetadata = async (fileData: File[]) => {
    try {
      const metadataArray = fileData.map((file) => ({
        fileName: file.name,
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
