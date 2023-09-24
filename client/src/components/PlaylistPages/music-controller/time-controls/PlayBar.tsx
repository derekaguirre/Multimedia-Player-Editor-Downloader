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
  //Local states
  const seekBarRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Passive calculation of the progress bar
  useEffect(() => {
    if (currentHowl && seekBarRef.current && progressBarRef.current) {
      const seekBar = seekBarRef.current;
      const progressBar = progressBarRef.current;
      const durationInSeconds = fullDuration || 0;

      // Calculate the percentage of progress
      const progressPercentage = (currentTime / durationInSeconds) * 100;

      // Calculate the initial translation value to start at negative full duration
      const initialTranslation = "translateX(0%)";
      // Translate the play bar to the right based on the progress
      progressBar.style.transform = `translateX(${progressPercentage}%) ${initialTranslation}`;
    }
  }, [currentTime, currentHowl, fullDuration]);

  return (
    <div className="seekBar" ref={seekBarRef}>
      <div className="progressBar" ref={progressBarRef}></div>
    </div>
  );
};

export default PlaybackBar;
