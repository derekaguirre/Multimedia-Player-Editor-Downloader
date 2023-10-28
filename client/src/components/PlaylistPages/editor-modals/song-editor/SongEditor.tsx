import axios from "axios";
import React, { useState } from "react";
import "./SongEditor.scss";

const API_URL = "http://localhost:4000";

interface SongEditorProps {
  songId: string;
}

const SongEditor: React.FC<SongEditorProps> = ({ songId }) => {
  const [formData, setFormData] = useState({
    fileNameOriginal: "",
    fileNameFormatted: "",
    title: "",
    artist: "",
    album: "",
  });
  const [hasChanges, setHasChanges] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setHasChanges(true);
  };

  const editSong = async () => {
    if (!hasChanges) {
      return; // Prevent api call if all fields are empty
    }

    try {
      const updatedData = {
        fileNameOriginal: formData.fileNameOriginal,
        fileNameFormatted: formData.fileNameFormatted,
        title: formData.title,
        artist: formData.artist,
        album: formData.album,
      };

      const response = await axios.put(`${API_URL}/songs/${songId}/edit`, {
        updatedData,
      });

      if (response.status === 200) {
        console.log("Song:", songId, "updated successfully");
        setHasChanges(false);
      } else {
        console.error("Error updating song:", response.data.error);
      }
    } catch (error) {
      console.error("Error updating song:", error);
    }
  };

  return (
    <div className="edit-modal">
      <h2>Edit Song</h2>
      <form>
        <div className="form-group">
          <label>File Name Original:</label>
          <input
            type="text"
            name="fileNameOriginal"
            value={formData.fileNameOriginal}
            onChange={handleFormChange}
          />
        </div>
        <div className="form-group">
          <label>File Name Formatted:</label>
          <input
            type="text"
            name="fileNameFormatted"
            value={formData.fileNameFormatted}
            onChange={handleFormChange}
          />
        </div>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
          />
        </div>
        <div className="form-group">
          <label>Artist:</label>
          <input
            type="text"
            name="artist"
            value={formData.artist}
            onChange={handleFormChange}
          />
        </div>
        <div className="form-group">
          <label>Album:</label>
          <input
            type="text"
            name="album"
            value={formData.album}
            onChange={handleFormChange}
          />
        </div>
        <button type="button" onClick={editSong}>
          Save
        </button>
      </form>
    </div>
  );
};

export default SongEditor;
