import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { PlaylistContext } from "../../StateContexts/PlaylistContext";
import "./PlaylistFetcher.scss";
const API_URL = "http://localhost:4000";

interface PlaylistProps {
  _id: string;
  name: string;
}

const PlaylistFetcher: React.FC = () => {
  //Context States
  // const { isPlaying, setIsPlaying } = useContext(PlayingContext);
  // const { currentSongIndex, setCurrentSongIndex } = useContext(IndexContext);
  const { setCurrentPlaylistId, setCurrentPlaylistName } = useContext(PlaylistContext);

  //Local states
  const [playlists, setPlaylists] = useState<PlaylistProps[]>([]);

  useEffect(() => {
    fetchAllPlaylists();
  }, []);

  const fetchAllPlaylists = async () => {
    try {
      const response = await axios.get(`${API_URL}/playlist/names`);
      // console.log("FETCHING PLAYLISTS FOR SIDEBAR: ", response.data);
      setPlaylists(response.data);
    } catch (error) {
      console.error("Error fetching playlist data:", error);
    }
  };

  //Switch playlists utilizing context
  //prettier-ignore
  const handlePlaylistClick = (playlistId: string, playlistName: string) => {
    localStorage.setItem("currentPlaylistId", playlistId);
    localStorage.setItem("currentPlaylistName", playlistName);

    setCurrentPlaylistId(playlistId);
    setCurrentPlaylistName(playlistName);
    // setIsPlaying(false);
    // setCurrentSongIndex(0);
  };


  //TODO Conditionally render either all playlists or a prompt that lets you create a playlist
  return (
    <div className="playlist-items">
      <ul>
        {playlists.map((playlist) =>
          // prettier-ignore
          <li key={playlist._id} onClick={() => handlePlaylistClick(playlist._id, playlist.name)}>
            {playlist.name}
          </li>
        )}
      </ul>
    </div>
  );
};

export default PlaylistFetcher;
