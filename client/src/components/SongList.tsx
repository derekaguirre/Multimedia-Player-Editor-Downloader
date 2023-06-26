import React, { useEffect, useState } from "react";

const SongPlaylist = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    // Fetch the list of songs from the server or any other data source
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      // Make an API request to fetch the songs from the server
      const response = await fetch("http://localhost:4000/files/");
      const data = await response.json();
      setSongs(data);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  //antd
  //react-player
  return (
    <div>
      <h2>Song Playlist</h2>
      <ul>
        {/* {songs.map((song) => (
          <li key={song.id}>{song.title}</li>
        ))} */}
      </ul>
    </div>
  );
};

export default SongPlaylist;