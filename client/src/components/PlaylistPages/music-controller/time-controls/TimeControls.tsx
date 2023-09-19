import { Howl } from "howler";
import React, { useEffect, useState } from "react";

//Can memorize both the playlist and the song or just use a state for the song
// local storage might be better for persistence.

//TODO implement prev / next song feature
//TODO maybe a shuffle

interface TimeProps {
  currentHowl: typeof Howl | null;
  fullDuration: number | null;
}

const TimeControls: React.FC<TimeProps> = ({ currentHowl, fullDuration }) => {
  const { Howl } = require("howler");

  //Local states
  const [currentTime, setCurrentTime] = useState<number>(0); // State to store current time

  useEffect(() => {
    timerLogic(currentHowl);
  }, [currentHowl]);

  const timerLogic = (currentHowl: typeof Howl | null) => {
    let updateInterval: NodeJS.Timeout | null = null;

    if (currentHowl) {
      // Update the current song timer every quarter of a second
      updateInterval = setInterval(() => {
        if (currentHowl.playing !== undefined && currentHowl.playing()) {
          const newCurrentTime = currentHowl.seek();
          if (newCurrentTime >= 0) {
            setCurrentTime(newCurrentTime);
          }
        }
      }, 250);
    }
    return () => {
      // Clear the interval when the component unmounts or when currentHowl changes
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  };

  // Function to format duration in minutes and seconds
  function timeFormatter(durationInSeconds: number) {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  return (
    <div className="songTimeElements">
      <div className="currTime">{timeFormatter(currentTime)}</div>
      <div className="playBar"></div>
      <div className="endTime">
        {fullDuration !== null ? timeFormatter(fullDuration) : "0:00"}
      </div>
    </div>
  );
};
export default TimeControls;
