import { Howl } from "howler";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SeekContext } from "./../../../SeekContext";

//Can memorize both the playlist and the song or just use a state for the song
// local storage might be better for persistence.

//TODO implement prev / next song feature
//TODO maybe a shuffle

//TODO instead of redrawing the width of the progress bar, make it the length of the play bar and just transform it in the right direction over the bar. consider using z-axis to hide it when not on the bar
//TODO seek bar moves every interval by itself. so disable seek calculation when holding the bar
//TODO add a div wrapper over seekbar that is invis but allows the hovering and seeking
//TODO fix the progress bar sliding off the end of the seek bar
//TODO fix progress bar getting stuck to the cursor when dragging off the seek bar

interface TimeProps {
  currentHowl: Howl | null;
  fullDuration: number | null;
}

const TimeControls: React.FC<TimeProps> = ({ currentHowl, fullDuration }) => {
  const { Howl } = require("howler");

  //Local states
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [seekPosition, setSeekPosition] = useState(0);
  const { isSeeking, setIsSeeking } = useContext(SeekContext);

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
      }, 500);
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

  // Passive calculation of the progress bar
  const calculateSeekBarWidth = () => {
    if (currentHowl && fullDuration) {
      return `${(currentTime / fullDuration) * 100}%`;
    }
    return "0%";
  };

  // Set progress bar width state
  useEffect(() => {
    setProgressBarWidth(calculateSeekBarWidth());
  }, [currentHowl, fullDuration, currentTime]);

  const handleSeekStart = () => {
    if (!isSeeking) {
      setIsSeeking(true);
    }
  };

  const handleSeekRelease = () => {
    if (isSeeking) {
      // Only seek and remove the mousemove event listener if dragging is active
      if (currentHowl) {
        currentHowl.seek(seekPosition);
      }
      setIsSeeking(false);
      console.log("RELEASE PROGRESS", progressBarWidth)
    }
  };

  const handleSeekDrag = (event: MouseEvent) => {
    if (isSeeking) {
      event.preventDefault();
      const progressBar = seekBarRef.current;
      if (progressBar) {
        const boundingBox = progressBar.getBoundingClientRect();
        const newPosition =
          (event.clientX - boundingBox.left) / boundingBox.width;
        const durationInSeconds = fullDuration || 0;
        const newSeekPosition = newPosition * durationInSeconds;
        setSeekPosition(newSeekPosition);
        setProgressBarWidth(`${newPosition * 100}%`);

        console.log("SEEKING PROGRESS", `${newPosition * 100}%`)
      }
    }
  };

  const seekBarRef = useRef<HTMLDivElement | null>(null);
  const [progressBarWidth, setProgressBarWidth] = useState("0%"); // Store progress bar width

  useEffect(() => {
    if (isSeeking) {
      document.addEventListener("mousemove", handleSeekDrag);
      document.addEventListener("mouseup", handleSeekRelease);
      // Remove the mousemove and mouseup event listeners when the component unmounts
      return () => {
        document.removeEventListener("mousemove", handleSeekDrag);
        document.removeEventListener("mouseup", handleSeekRelease);
      };
    }
  }, [isSeeking]);

  return (
    <div className="songTimeElements">
      <div className="currTime">{timeFormatter(currentTime)}</div>
      <div
        className="seekBar"
        onMouseDown={handleSeekStart}
        ref={seekBarRef}
      >
        <div className="progress" style={{ width: progressBarWidth }}></div>
      </div>
      <div className="endTime">
        {fullDuration !== null ? timeFormatter(fullDuration) : "0:00"}
      </div>
    </div>
  );
};

export default TimeControls;
