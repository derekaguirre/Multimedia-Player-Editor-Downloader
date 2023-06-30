import React from "react";

interface ResizerProps {
  sidebarRef: React.RefObject<HTMLDivElement>;
  isResizing: boolean;
  setIsResizing: React.Dispatch<React.SetStateAction<boolean>>;
  hideSidebar: () => void; // Include the hideSidebar property
}

const Resizer: React.FC<ResizerProps> = ({ sidebarRef, isResizing, setIsResizing, hideSidebar }) => {
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsResizing(true);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  return (
    <div className={`resizer ${isResizing ? "resizing" : ""}`} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      <div className="handle" />
    </div>
  );
};

export default Resizer;
