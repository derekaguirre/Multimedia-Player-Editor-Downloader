import { Howl } from "howler";
import React, { useEffect, useState } from "react";
import PlaybackBar from "./PlayBar";
import "./TimeControls.scss";

// Can memorize both the playlist and the song or just use a state for the song
// local storage might be better for persistence.

//TODO implement prev / next song feature
//TODO maybe a shuffle
interface TimeProps {
  currentHowl: Howl | null;
  fullDuration: number | null;
}

const TimeControls: React.FC<TimeProps> = ({ currentHowl, fullDuration }) => {
  const { Howl } = require("howler");

  //Local states
  const [currentTime, setCurrentTime] = useState<number>(0);

  //Refresh this component every time a new song gets picked
  useEffect(() => {
    timerLogic(currentHowl);
  }, [currentHowl]);

  const timerLogic = (currentHowl: typeof Howl | null) => {
    let updateInterval: NodeJS.Timeout | null = null;

    // Update the song timer in ms intervals
    if (currentHowl) {
      updateInterval = setInterval(() => {
        if (currentHowl.playing !== undefined && currentHowl.playing()) {
          const newCurrentTime = currentHowl.seek();
          if (newCurrentTime >= 0) {
            setCurrentTime(newCurrentTime);
          }
        }
      }, 500);
    }
    return () => {
      // Clear the interval when the component unmounts or when currentHowl changes
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  };
  // Format time in minutes and seconds
  function timeFormatter(timeInSeconds: number) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  return (
    // prettier-ignore
    <div className="songTimeElements">
      <div className="currTime">{timeFormatter(currentTime)}</div>
      <PlaybackBar currentHowl={currentHowl} currentTime={currentTime} fullDuration={fullDuration}/>
      <div className="endTime">
        {fullDuration !== null ? timeFormatter(fullDuration) : "0:00"}
      </div>
    </div>
  );
};

export default TimeControls;
