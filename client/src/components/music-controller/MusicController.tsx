import React, { MouseEvent, useContext, useEffect, useState } from "react";
import { PlayerContext } from "../PlayerContext";
import { SongsContext } from "../SongsContext";
import "./MusicController.scss";
import SongControls from "./song-controls/SongControls";
import TimeControls from "./time-controls/TimeControls";


// TODO persist active song name and current time in song using local storage to continue listening session
// TODO Images on song entries
// TODO Implement playlist functionality, forward and backward through songs w/ AUTOPLAY
// TODO Implement shuffle
// TODO Allow for media buttons
// TODO Volume slider and make it persistent 

//TODO verify if howl states need to be manipulated or if active song is sufficient enough to be passed to children components

const MusicController: React.FC = () => {
  const { Howl } = require("howler");

  //PLAYLIST INFO PASSING TESTS--------------
  const { songs } = useContext(SongsContext);
  console.log("PLAYER SONGS",songs);

  const printTitleEntries = () => {
    const titleEntries = songs.map((song) => song.title);
    console.log("Title Entries:", titleEntries);
  };

  //--------------------------------
  
  //Context states
  //TODO look into storing this in the local storage for persistence
  const { activeSong } = useContext(PlayerContext);
  //Local states
  const [currentHowl, setCurrentHowl] = useState<null | typeof Howl>(null);
  const [isPlaying, setIsPlaying] = useState(false); // State to track playing/paused status
  const [fullDuration, setFullDuration] = useState<number | null>(null); // State to store full duration

  useEffect(() => {
    handleSongPlayback(activeSong);
  }, [activeSong]);
  
  // if the first song reaches == duration of said song
  // move next in array
  // do that until end of array
  // at end of array set index to 0.

  const handleSongPlayback = (activeSong: string | null) => {
    if (activeSong) {
      //If there is a song playing already when a new song is selected, unload the previous song
      if (currentHowl) {
        // setCurrentTime(0);
        // console.log("null howl", currentHowl);
        currentHowl.unload();
        setIsPlaying(false);
        console.log("PLAYING SONG:", activeSong);
      }

      //Set up the new song and overwrite states with new song
      const newHowl = new Howl({
        volume: 0.3,
        src: [activeSong],
        onload: function () {
          setFullDuration(newHowl.duration());
        },
      });
      setCurrentHowl(newHowl);
      setIsPlaying(true);
      newHowl.play();
    }
  };


  return (
    <div className="music-controller-container">
      <SongControls currentHowl= {currentHowl} isPlaying={isPlaying} setIsPlaying={setIsPlaying}/>
      <TimeControls currentHowl={currentHowl} fullDuration={fullDuration} />
      <button onClick={printTitleEntries}>Print Titles</button>
    </div>
  );
};
export default MusicController;
