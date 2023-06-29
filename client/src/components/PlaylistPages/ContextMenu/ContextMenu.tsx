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

  const menuStyle: React.CSSProperties = {
    position: "absolute",
    top: `${y - 20}px`,
    left: `${x + 20}px`,
    zIndex: 20,
  };

  return (
    
    <div className="context-menu" ref={contextMenuRef} style={menuStyle}>
      <div className="item"> Option 1</div>
      <div className="item"> Option 2</div>
      <div className="item"> Option 3</div>
      <div className="item"> Option 4</div>
      <div className="item"> Option 5</div>
    </div>
  );
};

export default ContextMenu;
