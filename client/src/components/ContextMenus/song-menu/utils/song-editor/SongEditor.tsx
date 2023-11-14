import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { EditContext } from "../../../../StateContexts/EditContext";
import { SongObject } from "../../../../StateContexts/SongsContext";
import "./SongEditor.scss";

const API_URL = "http://localhost:4000";

interface SongEditorProps {
  songId: string;
  onClose: () => void;
  songData: SongObject;
}

const SongEditor: React.FC<SongEditorProps> = ({ songId, onClose, songData, }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { isEdited, setIsEdited } = useContext(EditContext);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Set form entries and add starting value
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

  // Extract image buffer from file
  const readImageAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64ImageBuffer = result.split(",")[1];
        resolve(base64ImageBuffer);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle file uploading with a constraint on the file type
  const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if the selected file type is allowed
      if (allowedFileTypes.includes(file.type)) {
        setSelectedImage(file);
        setHasChanges(true);
      } else {
        console.error("Invalid file type. Please select a valid image file.");
      }
    }
  };
  
  // Trigger the file input click when the image is clicked
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Verify that all form entries are filled out
  const validateForm = () => {
    if (Object.values(formData).some((value) => value.trim() === "")) {
      setErrorMessage("Please fill out all fields.");
      return false;
    }
    setErrorMessage(""); // Clear the error message if validation passes
    return true;
  };

  // Upload all information to the server to save on database
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
      let newImageBuffer = "";
      let newMime = "";
      if (selectedImage) {
        newMime = selectedImage.type;
        newImageBuffer = await readImageAsBase64(selectedImage);
      }

      const frontData = {
        title: formData.title,
        artist: formData.artist,
        _id: songId,
        fileNameFormatted: encodeURIComponent(formData.title),
        album: formData.album,
        image: {
          mime: newMime,
          imageBuffer: newImageBuffer,
        },
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
  return (
    <div className="edit-modal">
      {/* SONG INFORMATION */}
      <div className="songDataContainer">
        <div className="songImage" onClick={handleImageClick}>
          <img
            src={`data:${songData.image[0].mime};base64,${songData.image[0].imageBuffer}`}
            alt={`${songData.title} Image`}
            width="150px"
            height="150px"
          />
          <input
            type="file"
            id="fileInput"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept=".png, .jpeg, .jpg"
          />
        </div>
        <div className="editorData">
          <div className="editorTitle">{songData.title}</div>
          <div className="editorArtist">{songData.artist}</div>
          <div className="editorAlbum">{songData.album}</div>
        </div>
      </div>
      {/* SONG EDITOR FORMS */}
      <form onSubmit={editSong}>
        {Object.entries(formData).map(([field, value]) => (
          <div className="form-group" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            {/* prettier-ignore */}
            <input type="text" name={field} value={formData[field]} onChange={handleFormChange} required />
          </div>
        ))}
        {/* Display the error message if form validation falls through */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".png, .jpeg, .jpg"
          />
        </div>
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
