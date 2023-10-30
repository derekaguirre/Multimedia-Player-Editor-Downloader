import axios from "axios";
import React, { useContext, useState } from "react";
import { EditContext } from "../../../Contexts/EditContext";
import "./SongEditor.scss";

const API_URL = "http://localhost:4000";

interface SongEditorProps {
  songId: string;
  onClose: () => void;
}

const SongEditor: React.FC<SongEditorProps> = ({ songId, onClose }) => {
  console.log("EDITOR OPEN");
  const { isEdited, setIsEdited } = useContext(EditContext);

  
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
      onClose(); // Close the editor if there are no changes
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
        setIsEdited(!isEdited);
        onClose(); // Close the editor after successful update
      } else {
        console.error("Error updating song:", response.data.error);
      }
    } catch (error) {
      console.error("Error updating song:", error);
    }
  };

  // File names may have to be stored as "Song - Artist" to avoid collisions
  // or they can be ids until you export them, which will populate the file's name/metadata with the database info.
  //Upon editing, can achieve following functionality:
  //Update table with new information
  //Store changes into local storage and wait until a 'songs' refresh to populate with new changes
  //That way the song path doesn't get updated and the currentSongs list doesn't have an outdated song path.
  return (
    <div className="edit-modal">
      <h2>Edit Song</h2>
      <form>
        <div className="form-group">
          <label>File Name Original</label>
          <input
            type="text"
            name="fileNameOriginal"
            value={formData.fileNameOriginal}
            onChange={handleFormChange}
          />
        </div>
        <div className="form-group">
          <label>File Name Formatted</label>
          <input
            type="text"
            name="fileNameFormatted"
            value={formData.fileNameFormatted}
            onChange={handleFormChange}
          />
        </div>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
          />
        </div>
        <div className="form-group">
          <label>Artist</label>
          <input
            type="text"
            name="artist"
            value={formData.artist}
            onChange={handleFormChange}
          />
        </div>
        <div className="form-group">
          <label>Album</label>
          <input
            type="text"
            name="album"
            value={formData.album}
            onChange={handleFormChange}
          />
        </div>
        <div className="footer-buttons">
          <button type="button" onClick={editSong}>
            Save
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SongEditor;
