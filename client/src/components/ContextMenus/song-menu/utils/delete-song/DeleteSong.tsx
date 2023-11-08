import axios from "axios";
import { useContext } from "react";
import { EditContext } from "../../../../StateContexts/EditContext";
import { PlayerContext } from "../../../../StateContexts/PlayerContext";
const API_URL = "http://localhost:4000";

interface ContextMenuProps {
  closeContextMenu: () => void;
}

const DeleteSong: React.FC<ContextMenuProps> = ({ closeContextMenu }) => {
  //Context States
  const { activeSongId } = useContext(PlayerContext);
  const { isEdited, setIsEdited } = useContext(EditContext);

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/songs/${activeSongId}/delete`);
      setIsEdited(!isEdited);
    } catch (error) {
      console.error("Error deleting song:", error);
    }
    closeContextMenu();
  };

  return (
    <div className="item" onClick={handleDelete}>
      Delete
    </div>
  );
};

export default DeleteSong;
