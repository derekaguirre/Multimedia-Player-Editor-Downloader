import { Howl } from "howler";
import React, { useEffect, useRef, useState } from "react";

//TODO seek bar moves every interval by itself. so disable seek calculation when holding the bar
//TODO add a div wrapper over seekbar that extends the range of initiating a seek by 4px but is invis
//TODO fix the progress bar sliding off the end of the seek bar
//TODO add seek on click too
//TODO seek sometimes works every other drag, it would just snap to original location and ignore the drag

// Howl needed for seek
interface TimeProps {
  currentHowl: Howl | null;
  currentTime: number;
  fullDuration: number | null;
}

const PlaybackBar: React.FC<TimeProps> = ({
  currentHowl,
  currentTime,
  fullDuration,
}) => {
  // Local states
  const seekBarRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    if (
      !isDragging &&
      currentHowl &&
      seekBarRef.current &&
      progressBarRef.current
    ) {
      const seekBar = seekBarRef.current;
      const progressBar = progressBarRef.current;
      const durationInSeconds = fullDuration || 0;

      const progressPercentage = (currentTime / durationInSeconds) * 100;
      const initialTranslation = `translateX(${progressPercentage}%)`;

      if (progressBar) {
        progressBar.style.transform = initialTranslation;
      }
    }
  }, [currentTime, currentHowl, fullDuration, isDragging]);

  const handleSeekStart = () => {
    console.log("Seek Start");
    setIsDragging(true);
  };

  const handleSeekRelease: React.MouseEventHandler<HTMLDivElement> = (event) => {
    console.log("Seek Release");
    setIsDragging(false);

    if (currentHowl && seekBarRef.current) {
      const seekBar = seekBarRef.current;
      const progressBar = progressBarRef.current;
      const boundingBox = seekBar.getBoundingClientRect();
      const newPosition =
        (event.clientX - boundingBox.left) / boundingBox.width;
      const durationInSeconds = fullDuration || 0;
      const newSeekPosition = newPosition * durationInSeconds;

      if (!isDragging) {
        currentHowl.seek(newSeekPosition);
      }

      if (progressBar) {
        const progressPercentage = (newSeekPosition / durationInSeconds) * 100;
        progressBar.style.transform = `translateX(${progressPercentage}%)`;
      }
    }
  };

  const handleSeekDrag: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (isDragging && currentHowl && seekBarRef.current) {
      const seekBar = seekBarRef.current;
      const progressBar = progressBarRef.current;
      const boundingBox = seekBar.getBoundingClientRect();
      const newPosition =
        (event.clientX - boundingBox.left) / boundingBox.width;
      const durationInSeconds = fullDuration || 0;
      const newSeekPosition = newPosition * durationInSeconds;

      currentHowl.seek(newSeekPosition);

      if (progressBar) {
        const progressPercentage = (newSeekPosition / durationInSeconds) * 100;
        progressBar.style.transform = `translateX(${progressPercentage}%)`;
      }
    }
  };

  return (
    <div
      className="seekBar"
      ref={seekBarRef}
      onMouseDown={handleSeekStart}
      onMouseUp={handleSeekRelease}
      onMouseMove={handleSeekDrag}
    >
      <div className="progressBar" ref={progressBarRef}></div>
    </div>
  );
};

export default PlaybackBar;
