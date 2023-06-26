import React, { useEffect, useState } from "react";

const SongList = () => {
  const [files, setFiles] = useState<{ fileName: string; timestamp: string }[]>(
    []
  );

  const API_BASE = "http://localhost:4000"; // Define the API base URL

  useEffect(() => {
    const getFiles = async () => {
      try {
        const response = await fetch(API_BASE + "/files");
        const data = await response.json();
        setFiles(data);
      } catch (err) {
        console.error("Error: ", err);
      }
    };

    getFiles();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>File Name</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file, index) => (
          <tr key={index}>
            <td>{file.fileName}</td>
            <td>{file.timestamp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SongList;
