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

  const onDrop = async (acceptedFiles: File[]) => {
    const formData = new FormData();

    acceptedFiles.forEach((file) => {
      formData.append("uploadedFiles", file);
      formData.append("fileName", file.name);
      formData.append("filePath", file.webkitRelativePath);
      formData.append("fileSize", file.size.toString());
      formData.append("fileType", file.type);
    });

    console.log("Form Data:", formData.get("uploadedFiles"));
    console.log("filePath:", formData.get("filePath"));

    try {
      const response = await axios.post(`${API_URL}/files/new`, formData);
      console.log("Files uploaded successfully!");
      console.log("Response:", response.data); // Print the response from the server
      fetchFiles(); // Refresh the file list after successful upload
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
  );
};

export default FilePicker;
