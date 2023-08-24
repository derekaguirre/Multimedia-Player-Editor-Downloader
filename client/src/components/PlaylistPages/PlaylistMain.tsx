import React, { useState } from "react";
import { usePlaylist } from "../PlaylistContext";
import "./PlaylistMain.scss";
import FileUploader from "./file-uploader/FileUploader";
import MusicTable from "./music-table/MusicTable";

const API_URL = "http://localhost:4000";


//TODO if no playlist ID exists, create one
//can be achieved by checking local storage if playlistID is populated

// if()
//if not, then call api to create an empty playlist with a default name "New Playlist"
//TODO store playlist id in local storage
//TODO Remove honeycore from localstorage

//Pass current playlist name here consider refactoring musictable into here if overhead too large
//Pass fileuploader to encompass the whole page and only accept drops
//File uploader will be used again inside of settings with more visible usage i.e. button and dragging.
const PlaylistMain: React.FC = () => {
  const { currentPlaylistId, currentPlaylistName } = usePlaylist(); // Use the context hook
  // console.log("PL ID", {currentPlaylistId})

  return (
    <div className="PlaylistMain">
      <FileUploader />
      <div className="header">
        <h1>Name: {currentPlaylistName}</h1>
        <h1>Id: {currentPlaylistId}</h1>
      </div>
      <div className="PlaylistTableContainer">
        <MusicTable currentPlaylistId={currentPlaylistId} />
      </div>
    </div>
  );
}

export default PlaylistMain;
