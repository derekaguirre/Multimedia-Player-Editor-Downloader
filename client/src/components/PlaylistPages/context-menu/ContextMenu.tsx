import { FC, useRef } from "react";
import "./ContextMenu.scss";
import { useOnClickOutside } from "./useOnClickOutside";

interface ContextMenuProps {
  x: number;
  y: number;
  closeContextMenu: () => void;
}

const ContextMenu: FC<ContextMenuProps> = ({ x, y, closeContextMenu }) => {
  const contextMenuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(contextMenuRef, closeContextMenu);
  
  //TODO context menu scales further away from cursor when page is scrolled down
  const menuStyle: React.CSSProperties = {
    position: "fixed",
    top: `${y - 20}px`,
    left: `${x + 20}px`,
    zIndex: 20,
  };


  return (
    <div className="context-menu" ref={contextMenuRef} style={menuStyle}>
      <div className="item">Like</div>
      <div className="item">Edit</div>
      <div className="item">Hide</div>
      <div className="item">Delete</div>
    </div>
  );
};

export default ContextMenu;
