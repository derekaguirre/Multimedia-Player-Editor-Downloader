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
// TODO Songs not being updated if selecting new playlist song. It currently plays the last populated array until sorting is executed
// again. Upon sorting it populates with the new songs.

// TODO clean up usage of howl for example can pull duration from db or even from the songs obj if mapped just like songTitles
// TODO persist active song name and current time in song using local storage to continue listening session
// TODO Images on song entries
// TODO Implement shuffle
// TODO Allow for media buttons
// TODO autoplay or prev/next buttons do not work if only one song is in the playlist

const MusicController: React.FC = () => {
  // Context states
  const { activeSong, setActiveSong } = useContext(PlayerContext);
  const { currentSongIndex, setCurrentSongIndex } = useContext(IndexContext);
  const { isPlaying, setIsPlaying } = useContext(PlayingContext);
  const { songs, setSongs } = useContext(SongsContext); 
  const { currentPlaylistId, setCurrentPlaylistId } = useContext(PlaylistContext);
  const { sortingLock} = useContext(SortingLockContext);
  const { sortedSongs, setSortedSongs } = useContext(SortedSongsContext);

  // useEffect(() => {
  //   // console.log("PLAYER Sorted Songs:", sortedSongs);
  //   // console.log("PLAYER REGULAR songs:", songs);
  // }, [sortedSongs]);

  // Local states
  const [playingSongs, setPlayingSongs] = useState<SongObject[]>([]);

  const [currentHowl, setCurrentHowl] = useState<null | typeof Howl>(null);
  const storedVolume = localStorage.getItem("volume");
  const [volume, setVolume] = useState<number>(
    storedVolume ? parseFloat(storedVolume) : 0.5
  );
  const [songTitles, setSongTitles] = useState<string[]>([]);

  //TODO can possibly remove
  const [fullDuration, setFullDuration] = useState<number | null>(null);

  //Extract the only the urls for the songs
  // `${API_URL}/uploads/${song.fileNameFormatted}`

  // TODO look into changing this snippet when playlists get updated and clicked on
  // When sorting order is changed, it reloads player with new array of songs. Will not play until user manually triggers the playing state
  useEffect(() => {
    if (sortedSongs.length > 0) {
      console.log("POPULATING SORTED songs", playingSongs);
      setPlayingSongs(sortedSongs);
    } else {
      setPlayingSongs(songs);
      console.log("POPULATING UNSORTED songs", playingSongs);
    }
  }, [sortingLock]);


  // useEffect(() => {
  //   console.log("SORTED SONGS UPDATE", setPlayingSongs(sortedSongs))
  // }, [sortedSongs]);
  //Once the new playlist is populated all of the titles will be extracted and put in their own array
  useEffect(() => {
    const extractedTitles = playingSongs.map(
      (song) => `${API_URL}/uploads/${song.fileNameFormatted}`
    );
    setSongTitles(extractedTitles);
  }, [playingSongs]);

  //If the active song or entire playlist changes, use that song to play
  useEffect(() => {
    handleSongPlayback(songTitles[currentSongIndex]);
  }, [songTitles, currentSongIndex]);

  //Listening for manual song change from MusicTableContent
  useEffect(() => {
    if (isPlaying && currentHowl) {
      currentHowl.play();
    }
  }, [isPlaying, currentHowl]);


  //Gets rid of the current howl to load a new one
  const handleSongPlayback = (songUrl: string | null) => {
    if (songUrl) {
      if (currentHowl) currentHowl.unload();

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
  console.log("Player loaded");

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
