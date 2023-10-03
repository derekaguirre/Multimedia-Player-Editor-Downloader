import React, { useContext, useEffect, useState } from "react";
import { IndexContext } from "../IndexContext";
import { PlayerContext } from "../PlayerContext";
import { PlayingContext } from "../PlayingContext";
import { PlaylistContext } from "../PlaylistContext";
import { SongsContext } from "../SongsContext";
import "./MusicController.scss";
import SongControls from "./song-controls/SongControls";
import TimeControls from "./time-controls/TimeControls";
import VolumeControls from "./volume-controls/VolumeControls";
const { Howl } = require("howler");
const API_URL = "http://localhost:4000";
// TODO When switching playlists, it plays the song at the active index. so if i have i = 20 in playlist 2
//      and switch to playlist 1 it plays song 20 in that playlist, find a way to not switch songs

// TODO clean up usage of howl for example can pull duration from db or even from the songs obj if mapped just like songTitles
// TODO persist active song name and current time in song using local storage to continue listening session
// TODO Images on song entries
// TODO Implement shuffle
// TODO Allow for media buttons

const MusicController: React.FC = () => {
  // Context states
  const { activeSong, setActiveSong } = useContext(PlayerContext);
  const { currentSongIndex, setCurrentSongIndex } = useContext(IndexContext);
  const { isPlaying, setIsPlaying } = useContext(PlayingContext);
  const { songs } = useContext(SongsContext);
  const { currentPlaylistId, setCurrentPlaylistId } = useContext(PlaylistContext);

  // Local states
  const [currentHowl, setCurrentHowl] = useState<null | typeof Howl>(null);
  const storedVolume = localStorage.getItem("volume");
  const [volume, setVolume] = useState<number>(storedVolume ? parseFloat(storedVolume) : 0.5);
  const [songTitles, setSongTitles] = useState<string[]>([]);

  //TODO can possibly remove
  const [fullDuration, setFullDuration] = useState<number | null>(null);


  
  //Extract the only the urls for the songs
  // `${API_URL}/uploads/${song.fileNameFormatted}`

  useEffect(() => {
    const extractedTitles = songs.map(
      (song) => `${API_URL}/uploads/${song.fileNameFormatted}`
    );
    setSongTitles(extractedTitles);
  }, [songs]);

  //Listening for song change from MusicTableContent
  useEffect(() => {
    if (isPlaying && currentHowl) {
      currentHowl.play();
    }
  }, [isPlaying, currentHowl]);

  //If the active song or entire playlist changes, use that song to play
  useEffect(() => {
    handleSongPlayback(songTitles[currentSongIndex]);
  }, [songTitles, currentSongIndex]);

  //Get rid of the current howl to load a new one
  const handleSongPlayback = (songUrl: string | null) => {
    if (songUrl) {
      if (currentHowl)
        currentHowl.unload();
      
      //TODO: Don't think I need since I have an index in the array.
      const matchingTitle = songTitles.find((title) => title === songUrl);

      if (matchingTitle) {
        const newHowl = new Howl({
          volume: volume,
          src: [matchingTitle],
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
    }
  };

  const handleAutoPlay = () => {
    const nextSongIndex = currentSongIndex + 1;

    if (nextSongIndex >= songTitles.length) {
      // Reset to the beginning of the array
      setActiveSong(songTitles[0]);
      setCurrentSongIndex(0);
    } else {
      const nextSongUrl = songTitles[nextSongIndex];
      console.log("Autoplaying next song: ", nextSongUrl);
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
