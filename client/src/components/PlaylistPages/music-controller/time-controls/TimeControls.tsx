import { Howl } from "howler";
import React, { useEffect, useState } from "react";
import PlaybackBar from "./PlayBar";
import "./TimeControls.scss";

interface TimeProps {
  currentHowl: Howl | null;
  fullDuration: number | null;
}

// Helper function to format time in minutes and seconds
function timeFormatter(timeInSeconds: number): string {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

const TimeControls: React.FC<TimeProps> = ({ currentHowl, fullDuration }) => {
  // Local states
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false); // Track seeking state

  // This useEffect runs once when the component is mounted and clears the interval when the component unmounts
  useEffect(() => {
    let updateInterval: NodeJS.Timeout | null = null;

    const timerLogic = () => {
      if (currentHowl) {
        updateInterval = setInterval(() => {
          if (!isSeeking && currentHowl.playing !== undefined && currentHowl.playing()) {
            const newCurrentTime = currentHowl.seek();
            if (newCurrentTime >= 0) {
              setCurrentTime(newCurrentTime);
            }
          }
        }, 500);
      }
    };

    timerLogic();

    return () => {
      // Clear the interval when the component unmounts
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, [currentHowl, isSeeking]);

  return (
    <div className="songTimeElements">
      <div className="currTime">{timeFormatter(currentTime)}</div>
      <PlaybackBar
        currentHowl={currentHowl}
        currentTime={currentTime}
        fullDuration={fullDuration}
        setCurrentTime={setCurrentTime}
        setIsSeeking={setIsSeeking} // Pass setIsSeeking to PlaybackBar
      />
      <div className="endTime">
        {fullDuration !== null ? timeFormatter(fullDuration) : "0:00"}
      </div>
    </div>
  );
};

export default TimeControls;
