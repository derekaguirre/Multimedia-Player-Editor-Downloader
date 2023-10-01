import { Howl } from "howler";
import React, { useEffect, useRef, useState } from "react";
import "./VolumeControls.scss";

//TODO add a div wrapper over seekbar that extends the range of initiating a seek by 4px but is invis
//TODO disable highlighting of other components while dragging the bar
//TODO Allow for progress bar to be dragged even if the cursor leaves the component
//TODO handleSeekDrag fires off every pixel traveled while hovering the seek bar

interface VolumeControlsProps {
  currentHowl: Howl | null;
  volume: number;
  setVolume: (volume: number) => void;
}

const VolumeControls: React.FC<VolumeControlsProps> = ({
  currentHowl,
  volume,
  setVolume,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const volumeBarRef = useRef<HTMLDivElement | null>(null);
  const volumeSliderRef = useRef<HTMLDivElement | null>(null);

  // Set the initial position of the volume slider once (0 to 1 scale)
  useEffect(() => {
    if (volumeSliderRef.current) {
      const newPosition = volume * 100;
      volumeSliderRef.current.style.transform = `translateX(${newPosition}%)`;
    }
  }, []);

  // Add a global mouseup event listener to set isDragging to false when releasing the click anywhere on the page
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging]);

  
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleVolumeChange = (newVolume: number) => {
    if (currentHowl) {
      currentHowl.volume(newVolume);
      localStorage.setItem("volume", newVolume.toString());
      setVolume(newVolume);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging && volumeBarRef.current && volumeSliderRef.current) {
      const volumeBar = volumeBarRef.current;
      const volumeSlider = volumeSliderRef.current;
      const boundingBox = volumeBar.getBoundingClientRect();
      const newPosition =
        (event.clientX - boundingBox.left) / boundingBox.width;
      const newVolume = Math.max(0, Math.min(1, newPosition));

      handleVolumeChange(newVolume);

      // Translate the volume slider based on the new volume
      volumeSlider.style.transform = `translateX(${newVolume * 100}%)`;
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    if (volumeBarRef.current && volumeSliderRef.current) {
      const volumeBar = volumeBarRef.current;
      const boundingBox = volumeBar.getBoundingClientRect();
      const newPosition =
        (event.clientX - boundingBox.left) / boundingBox.width;
      const newVolume = Math.max(0, Math.min(1, newPosition));

      handleVolumeChange(newVolume);

      // Translate the volume slider based on the new volume
      volumeSliderRef.current.style.transform = `translateX(${
        newVolume * 100
      }%)`;
    }
  };

  return (
    <div
      className="volumeBar"
      ref={volumeBarRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <div className="volumeSlider" ref={volumeSliderRef}></div>
    </div>
  );
};

export default VolumeControls;
