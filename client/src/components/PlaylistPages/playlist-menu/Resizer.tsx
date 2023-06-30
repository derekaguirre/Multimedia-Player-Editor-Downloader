import React, { useEffect } from "react";


//first click is ignored
interface ResizerProps {
  sidebarRef: React.RefObject<HTMLDivElement>;
  isResizing: boolean;
  setIsResizing: (isResizing: boolean) => void;
}

const Resizer: React.FC<ResizerProps> = ({
  sidebarRef,
  isResizing,
  setIsResizing,
}) => {
  useEffect(() => {
    const resizer = document.querySelector(".resizer") as HTMLElement;
    const sidebar = sidebarRef.current;

    function initResizerFn(resizer: HTMLElement, sidebar: HTMLElement) {
      let x: number, w: number;

      function rs_mousedownHandler(e: MouseEvent) {
        x = e.clientX;
        setIsResizing(true);

        const sbWidth = window.getComputedStyle(sidebar).width;
        w = parseInt(sbWidth, 10);

        document.addEventListener("mousemove", rs_mousemoveHandler);
        document.addEventListener("mouseup", rs_mouseupHandler);
      }

      function rs_mousemoveHandler(e: MouseEvent) {
        if (!isResizing) return;

        const dx = e.clientX - x;
        const cw = w + dx;

        if (cw < 700) {
          sidebar.style.width = `${cw}px`;
        }
      }

      function rs_mouseupHandler() {
        document.removeEventListener("mouseup", rs_mouseupHandler);
        document.removeEventListener("mousemove", rs_mousemoveHandler);
        setIsResizing(false);
      }

      resizer.addEventListener("mousedown", rs_mousedownHandler);
    }

    if (resizer && sidebar) {
      initResizerFn(resizer, sidebar);
    }
  }, [isResizing, sidebarRef]);

  return <div className="resizer"></div>;
};

export default Resizer;
