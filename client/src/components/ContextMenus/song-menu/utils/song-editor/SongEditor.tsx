import axios from "axios";
import React, { useContext, useState } from "react";
import { EditContext } from "../../../../StateContexts/EditContext";
import { SongObject } from "../../../../StateContexts/SongsContext";
import "./SongEditor.scss";

const API_URL = "http://localhost:4000";

interface SongEditorProps {
  songId: string;
  onClose: () => void;
  songData: SongObject;
}

const SongEditor: React.FC<SongEditorProps> = ({
  songId,
  onClose,
  songData,
}) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { isEdited, setIsEdited } = useContext(EditContext);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize formData with an index signature
  const [formData, setFormData] = useState<{ [key: string]: string }>({
    title: songData.title,
    artist: songData.artist,
    album: songData.album,
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setHasChanges(true);
  };

  const validateForm = () => {
    if (Object.values(formData).some((value) => value.trim() === "")) {
      setErrorMessage("Please fill out all fields.");
      return false;
    }
    setErrorMessage(""); // Clear the error message if validation passes
    return true;
  };

  const editSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Do not submit the form if validation fails
    }
    if (!hasChanges) {
      onClose();
      return;
    }

    try {
      const frontData = {
        title: formData.title,
        artist: formData.artist,
        _id: songId,
        fileNameFormatted: encodeURIComponent(formData.title),
        album: formData.album,
      };

      const response = await axios.put(`${API_URL}/songs/${songId}/edit`, {
        frontData,
      });

      console.error("Error updating song:", response.data.message);

      setHasChanges(false);
      setIsEdited(!isEdited);
      onClose();
    } catch (error) {
      setErrorMessage("Error: " + error.response.data.error);
    }
  };
  //Upon editing, can achieve following functionality:
  //Store changes into local storage and wait until a 'songs' refresh to populate with new changes
  console.log(songData.image[0].imageBuffer);
  return (
    <div className="edit-modal">
      <h2>Edit Song</h2>

      {/* SONG INFORMATION */}
      <div className="songDataContainer">
        <div className="songImage">
          <img
            src={`data:${songData.image[0].mime};base64,${songData.image[0].imageBuffer}`}
            alt={`${songData.title} Image`}
            width="120px"
            height="120px"
          />
        </div>
        <div className="editorData">
          <div className="editorTitle">{songData.title}</div>
          <div className="editorArtist">{songData.artist}</div>
          <div className="editorAlbum">{songData.album}</div>
        </div>
      </div>
      <div className="editorSeparator"></div>
      {/* SONG EDITOR FORMS */}
      <form onSubmit={editSong}>
        {Object.entries(formData).map(([field, value]) => (
          <div className="form-group" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleFormChange}
              required
            />
          </div>
        ))}
        {/* Display the error message if form validation falls through */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="footer-buttons">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SongEditor;
