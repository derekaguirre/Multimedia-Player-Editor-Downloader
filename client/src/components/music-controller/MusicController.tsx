import React, { useContext, useEffect, useState } from "react";
import { IndexContext } from "../IndexContext";
import { PlayerContext } from "../PlayerContext";
import { PlayingContext } from "../PlayingContext";
import { PlaylistContext } from "../PlaylistContext";
import { SongObject, SongsContext } from "../SongsContext";
import { SortedSongsContext } from "../SortedSongsContext";
import { SortingLockContext } from "../SortingLockContext";
import "./MusicController.scss";
import SongControls from "./song-controls/SongControls";
import TimeControls from "./time-controls/TimeControls";
import VolumeControls from "./volume-controls/VolumeControls";
const { Howl } = require("howler");
const API_URL = "http://localhost:4000";

// TODO when there's a search query, consider only making that query playable. so essentially populating with filteredSongs
// TODO persist active song name and current time in song using local storage to continue listening session
// TODO Image on song control bar (bottom left of page)
// TODO Implement shuffle
// TODO Allow for media buttons
// TODO prev/next buttons do not work if only one song is in the playlist

const MusicController: React.FC = () => {
  // Context states
  const { activeSong, setActiveSong } = useContext(PlayerContext);
  const { currentSongIndex, setCurrentSongIndex } = useContext(IndexContext);
  const { isPlaying, setIsPlaying } = useContext(PlayingContext);
  const { songs, setSongs } = useContext(SongsContext);
  const { sortingLock } = useContext(SortingLockContext); //Not using currently
  const { sortedSongs, setSortedSongs } = useContext(SortedSongsContext);
  const [playingSongs, setPlayingSongs] = useState<SongObject[]>([]);

  // Local states
  const [currentHowl, setCurrentHowl] = useState<null | typeof Howl>(null);
  const storedVolume = localStorage.getItem("volume");
  const [songTitles, setSongTitles] = useState<string[]>([]);
  const [volume, setVolume] = useState<number>(
    storedVolume ? parseFloat(storedVolume) : 0.5
  );
  
  //TODO can possibly remove since I have a field in the database now
  const [fullDuration, setFullDuration] = useState<number | null>(null);

  // This can be considered the hidden array that the system uses to play its music
  // Will check if the current song index and song name are different before updating playingSongs with new array
  useEffect(() => {
    if (currentSongIndex !== playingSongs.length || songs !== playingSongs) {
      setPlayingSongs(sortedSongs);
    }
  }, [currentSongIndex, activeSong]);


  //TODO clean up extra space usage, most likely do not need just an array of titles
  //Once the playingSongs state is populated, all of the titles will be extracted and put in their own array for easier usage.
  useEffect(() => {
    const extractedTitles = playingSongs.map(
      (song) => `${API_URL}/uploads/${song.fileNameFormatted}`
    );
    setSongTitles(extractedTitles);
  }, [playingSongs]);

  // Calls the logic for playing songs. Will execute every playlist or song change
  useEffect(() => {
    handleSongPlayback(songTitles[currentSongIndex]);
  }, [songTitles, currentSongIndex]);

  //Listening for manual song change from MusicTableContent, handles the playing state for the howl
  useEffect(() => {
    if (isPlaying && currentHowl) {
      currentHowl.play();
    }
  }, [isPlaying, currentHowl]);

  //Gets rid of the current howl to load a new one
  const handleSongPlayback = (songUrl: string | null) => {
    if (songUrl) {
      //Reset howl if one exists.
      if (currentHowl) currentHowl.unload();

        const newHowl = new Howl({
          volume: volume,
          src: [songTitles[currentSongIndex]],
          onload: function () {
            // TODO can possibly remove this since I have an duration inside of the songs object and an index. should look to implement set duration inside of TimeControls
            setFullDuration(newHowl.duration());
          },
          onend: function () {
            handleAutoPlay();
          },
        });

        setCurrentHowl(newHowl);
    }
  };

  //Autoplays unless there is only one song in the playlist, in which case, it will reset states if true
  const handleAutoPlay = () => {
    const nextSongIndex = currentSongIndex + 1;

    if (songTitles.length === 1) {
      setCurrentSongIndex(-1);
      //Delay the state change to ensure it updates correctly
      setTimeout(() => {
        setCurrentSongIndex(0);
      }, 20);
    } else if (nextSongIndex >= songTitles.length) {
      // Reset to the beginning of the array
      setActiveSong(songTitles[0]);
      setCurrentSongIndex(0);
    } else {
      const nextSongUrl = songTitles[nextSongIndex];
      setActiveSong(nextSongUrl);
      setCurrentSongIndex(nextSongIndex);
    }
  };

  return (
    <div className="music-controller-container">
      <div className="song-controls-container">
        <SongControls
          currentHowl={currentHowl}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          songTitles={songTitles}
          setActiveSong={setActiveSong}
        />
        <TimeControls currentHowl={currentHowl} fullDuration={fullDuration} />
      </div>
      <div className="volume-slider-container">
        <VolumeControls
          currentHowl={currentHowl}
          volume={volume}
          setVolume={setVolume}
        />
      </div>
    </div>
  );
};

export default MusicController;
