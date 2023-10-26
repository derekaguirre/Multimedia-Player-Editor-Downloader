import { useContext, useEffect, useRef, useState } from "react";
import { PlayerContext } from "../../Contexts/PlayerContext";
import "./ContextMenu.scss";
import { useOnClickOutside } from "./useOnClickOutside";


interface ContextMenuProps {
  x: number;
  y: number;
  closeContextMenu: () => void;
}


const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, closeContextMenu }) => {
  const { activeSongId } = useContext(PlayerContext);
  useEffect(() => {
    console.log("ContextMenu songId:", activeSongId);
  }, []);
  
  const contextMenuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(contextMenuRef, closeContextMenu);

  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({
    position: "fixed",
    top: y + "px", // Start at the initial click position
    left: x + "px", // Start at the initial click position
    zIndex: 1,
  });

  useEffect(() => {
    // Calculate the dimensions of the context menu
    const menuWidth = contextMenuRef.current?.offsetWidth || 0;
    const menuHeight = contextMenuRef.current?.offsetHeight || 0;

    // Calculate the dimensions of the viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate the adjusted position of the context menu
    let adjustedX = x;
    let adjustedY = y;

    if (x + menuWidth > viewportWidth) adjustedX = viewportWidth - menuWidth;

    if (y + menuHeight > viewportHeight) adjustedY = viewportHeight - menuHeight;

    if (x < 0) adjustedX = 0;

    if (y < 0) adjustedY = 0;

    setMenuStyle({
      ...menuStyle,
      top: `${adjustedY}px`,
      left: `${adjustedX}px`,
    });
  }, [x, y]);

  return (
    <div className="context-menu" ref={contextMenuRef} style={menuStyle}>
      <div className="item">Edit</div>
      {/* TODO Extend below option to allow for selecting correct playlist */}
      <div className="item">Add to playlist</div>
      <div className="item">Like</div>
      <div className="item">Hide</div>
      <div className="item">Delete</div>
    </div>
  );
};

export default ContextMenu;
