import React, { useState } from "react";
import "./SongEditor.scss";
interface SongEditorProps {
    songId: number;
  }


const SongEditor: React.FC<SongEditorProps> = ({ songId }) => {
  // const [songId, setSongId] = useState(0); 

  const handleSave = () => {
    // onClose();
  };

  return (
    <div className="edit-modal">
      <h2>Edit Song</h2>
      <form>
        {/* <button onClick={handleSave}>Save</button> */}
        {/* <button onClick={onClose}>Cancel</button> */}
      </form>
    </div>
  );
};

export default SongEditor;
