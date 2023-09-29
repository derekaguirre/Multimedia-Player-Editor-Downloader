import React, { useContext, useEffect, useState } from "react";
import { IndexContext } from "../IndexContext";
import { PlayerContext } from "../PlayerContext";
import { SongsContext } from "../SongsContext";
import "./MusicController.scss";
import SongControls from "./song-controls/SongControls";
import TimeControls from "./time-controls/TimeControls";
const { Howl } = require("howler");
const API_URL = "http://localhost:4000";
// TODO When switching playlists, it plays the song at the active index. so if i have i = 20 in playlist 2
//      and switch to playlist 1 it plays song 20 in that playlist, find a way to not switch songs

// TODO persist active song name and current time in song using local storage to continue listening session
// TODO Images on song entries
// TODO Implement forward and backward button to navigate through songs
// TODO Implement shuffle
// TODO Allow for media buttons
// TODO Volume slider and make it persistent

//TODO verify if howl states need to be manipulated or if active song is sufficient enough to be passed to children components

const MusicController: React.FC = () => {
  // useEffect(() => {
  //   console.log("MUSIC CONTROLLER TESTS**********");
  //   console.log("MusicController SONGTITLES", songTitles);
  //   console.log("MusicController active song:", activeSong);
  //   console.log("MusicController index:", currentSongIndex);
  // },[]);

  const { songs } = useContext(SongsContext);

  // Context states
  const { activeSong, setActiveSong } = useContext(PlayerContext);
  const {currentSongIndex, setCurrentSongIndex} = useContext(IndexContext);

  // Local states
  const [currentHowl, setCurrentHowl] = useState<null | typeof Howl>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fullDuration, setFullDuration] = useState<number | null>(null);
  const [songTitles, setSongTitles] = useState<string[]>([]);

  //Extract the only the urls for the songs
  // `${API_URL}/uploads/${song.fileNameFormatted}`
  useEffect(() => {
    const extractedTitles = songs.map((song) => `${API_URL}/uploads/${song.fileNameFormatted}`);
    setSongTitles(extractedTitles);
  }, [songs]);

  //If the active song or entire playlist changes, use that song to play
  useEffect(() => {
    console.log("Playing song: ", activeSong, "at index:", currentSongIndex)
    handleSongPlayback(songTitles[currentSongIndex]);
  }, [songTitles, currentSongIndex]);


  const handleSongPlayback = (songUrl: string | null) => {
    if (songUrl) {
      if (currentHowl) {
        currentHowl.unload();
        setIsPlaying(false);
      }

      //TODO: Don't think I need since I have an index in the array.
      const matchingTitle = songTitles.find((title) => title === songUrl);

      if (matchingTitle) {
        const newHowl = new Howl({
          volume: 0.3,
          src: [matchingTitle],
          onload: function () {
            setFullDuration(newHowl.duration());
          },
          onend: function () {
            // Automatically play the next song when the current song ends
            console.log("Song finished playing")
            playNextSong();
          },
        });

        setCurrentHowl(newHowl);
        setIsPlaying(true);
        newHowl.play();
      }
    }
  };
  const playNextSong = () => {
    if (currentSongIndex < songTitles.length - 1) {
      const nextSongIndex = currentSongIndex + 1;
      const nextSongUrl = songTitles[nextSongIndex];
      console.log("Autoplaying next song: ", nextSongUrl)
      setActiveSong(nextSongUrl);
      setCurrentSongIndex(nextSongIndex);
    }
  };

  return (
    <div className="music-controller-container">
      <SongControls currentHowl={currentHowl} isPlaying={isPlaying} setIsPlaying={setIsPlaying}/>
      <TimeControls currentHowl={currentHowl} fullDuration={fullDuration} />
    </div>
  );
};

export default MusicController;
