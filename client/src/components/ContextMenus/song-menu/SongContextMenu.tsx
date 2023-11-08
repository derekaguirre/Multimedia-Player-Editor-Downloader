import { useContext, useEffect, useRef, useState } from "react";

import { EditContext } from "../../StateContexts/EditContext";
import { PlayerContext } from "../../StateContexts/PlayerContext";
import { SongObject } from "../../StateContexts/SongsContext";
import { useOnClickOutside } from "../useOnClickOutside";
import "./../ContextMenu.scss";
import DeleteSong from "./utils/delete-song/DeleteSong";
import SongEditor from "./utils/song-editor/SongEditor";

interface ContextMenuProps {
  x: number;
  y: number;
  closeContextMenu: () => void;
  songData: SongObject;
}

const ContextMenu: React.FC<ContextMenuProps> = ({x,y,closeContextMenu,songData,}) => {
  // Local States:
  const [isSongEditorOpen, setIsSongEditorOpen] = useState(false);
  const { activeSongId } = useContext(PlayerContext);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({
    position: "fixed",
    top: y + "px",
    left: x + "px",
    zIndex: 1,
  });

  //Context States
  //TODO pass to sub-components instead
  const { isEdited, setIsEdited } = useContext(EditContext);

  // Calculate the dimensions of the context menu
  useEffect(() => {
    const menuWidth = contextMenuRef.current?.offsetWidth || 0;
    const menuHeight = contextMenuRef.current?.offsetHeight || 0;

    // Calculate the dimensions of the viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate the adjusted position of the context menu
    let adjustedX = x;
    let adjustedY = y;

    if (x + menuWidth > viewportWidth) adjustedX = viewportWidth - menuWidth;

    if (y + menuHeight > viewportHeight)
      adjustedY = viewportHeight - menuHeight;

    if (x < 0) adjustedX = 0;

    if (y < 0) adjustedY = 0;

    setMenuStyle({
      ...menuStyle,
      top: `${adjustedY}px`,
      left: `${adjustedX}px`,
    });
  }, [x, y]);

  const contextMenuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(contextMenuRef, closeContextMenu);

  //Refactor to send states to subcomponents that conditionally render them
  //Then drop the components in on the bottom of this return
  return (
    <div className="context-menu" ref={contextMenuRef} style={menuStyle}>
      <div className="item" onClick={() => setIsSongEditorOpen(true)}>
        Edit
      </div>
      {isSongEditorOpen && (
        <SongEditor
          songId={activeSongId}
          songData={songData}
          onClose={() => {
            setIsSongEditorOpen(false);
            closeContextMenu();
          }}
        />
      )}
      <div className="item">Add to playlist</div>
      <div className="item">Like</div>
      <div className="item">Hide</div>
      <DeleteSong closeContextMenu={closeContextMenu} />
    </div>
  );
};

export default ContextMenu;
