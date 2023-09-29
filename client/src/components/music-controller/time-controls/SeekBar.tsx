import { Howl } from "howler";
import React, { useEffect, useRef, useState } from "react";

//TODO add a div wrapper over seekbar that extends the range of initiating a seek by 4px but is invis
//TODO replace isDragging with isSeeking from parent component
//TODO disable highlighting of other components while dragging the bar
//TODO Allow for progress bar to be dragged even if the cursor leaves the component
//TODO handleSeekDrag fires off every pixel traveled while hovering the seek bar

interface TimeProps {
  currentHowl: Howl | null;
  currentTime: number;
  fullDuration: number | null;
  setCurrentTime: (time: number) => void;
  setIsSeeking: (isSeeking: boolean) => void;
}

const SeekBar: React.FC<TimeProps> = ({
  currentHowl,
  currentTime,
  fullDuration,
  setCurrentTime,
  setIsSeeking,
}) => {
  const seekBarRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [seekPosition, setSeekPosition] = useState<number | null>(null);

  useEffect(() => {
    if (!isDragging && currentHowl && seekBarRef.current && progressBarRef.current) {
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

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging && currentHowl && seekPosition !== null) {
        currentHowl.seek(seekPosition);
        setIsDragging(false);
        setIsSeeking(false);
        setSeekPosition(null);
      }
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, seekPosition, currentHowl, setIsSeeking]);

  const handleSeekStart = () => {
    setIsDragging(true);
    setIsSeeking(true);
  };

  const handleSeekDrag: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (isDragging && seekBarRef.current) {
      const seekBar = seekBarRef.current;
      const progressBar = progressBarRef.current;
      const boundingBox = seekBar.getBoundingClientRect();
      const newPosition =
        (event.clientX - boundingBox.left) / boundingBox.width;
      const durationInSeconds = fullDuration || 0;
      const newSeekPosition = newPosition * durationInSeconds;

      setSeekPosition(newSeekPosition);
      setCurrentTime(newSeekPosition);

      if (progressBar) {
        const progressPercentage = (newSeekPosition / durationInSeconds) * 100;
        progressBar.style.transform = `translateX(${progressPercentage}%)`;
      }
    }
  };

  const handleSeekClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!isDragging && currentHowl && seekBarRef.current) {
      const seekBar = seekBarRef.current;
      const boundingBox = seekBar.getBoundingClientRect();
      const newPosition =
        (event.clientX - boundingBox.left) / boundingBox.width;
      const durationInSeconds = fullDuration || 0;
      const newSeekPosition = newPosition * durationInSeconds;

      currentHowl.seek(newSeekPosition);
      setSeekPosition(newSeekPosition);
      setCurrentTime(newSeekPosition);

      if (progressBarRef.current) {
        const progressPercentage = (newSeekPosition / durationInSeconds) * 100;
        progressBarRef.current.style.transform = `translateX(${progressPercentage}%)`;
      }
    }
  };

  return (
    <div
      className="seekBar"
      ref={seekBarRef}
      onMouseDown={handleSeekStart}
      onMouseMove={handleSeekDrag}
      onClick={handleSeekClick}
    >
      <div className="progressBar" ref={progressBarRef}></div>
    </div>
  );
};

export default SeekBar;
