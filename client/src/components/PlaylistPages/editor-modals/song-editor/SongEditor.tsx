import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { EditContext } from "../../../Contexts/EditContext";
import { SongObject } from "../../../Contexts/SongsContext";
import "./SongEditor.scss";

const API_URL = "http://localhost:4000";

interface SongEditorProps {
  songId: string;
  onClose: () => void;
  songData: SongObject;
}
const nameFormatter = (str: string) => {
  return encodeURIComponent(str);
};

const SongEditor: React.FC<SongEditorProps> = ({ songId, onClose, songData }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { isEdited, setIsEdited } = useContext(EditContext);

  const [formData, setFormData] = useState({
    title: songData.title,
    artist: songData.artist,
    album: songData.album,
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

  useEffect(() => {
    setFormData({
      title: songData.title,
      artist: songData.artist,
      album: songData.album,
    });
  }, [songData]);

  const editSong = async () => {
    if (!hasChanges) {
      onClose(); // Close the editor if there are no changes
      return; // Prevent api call if all fields are empty
    }

    try {
      const frontData = {
        title: formData.title,
        artist: formData.artist,
        _id: songId,
        fileNameFormatted: nameFormatter(formData.title),
        album: formData.album,
      };

      const response = await axios.put(`${API_URL}/songs/${songId}/edit`, {
        frontData,
      });

      console.error("Error updating song:", response.data.message);
      
      setHasChanges(false);
      setIsEdited(!isEdited);
      onClose(); // Close the editor after successful update
    } catch (error) {
      // Handle the network or other errors and set the error message
      setErrorMessage("Error: " + error.response.data.error);
    }
  };

  //Upon editing, can achieve following functionality:
  //Store changes into local storage and wait until a 'songs' refresh to populate with new changes
  return (
    <div className="edit-modal">
      <h2>Edit Song</h2>
      {/* PUT SONG INFO HERE */}
      <form>
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

        {/* Display the error message */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

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
