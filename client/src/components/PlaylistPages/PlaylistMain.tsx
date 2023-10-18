import React from "react";
import { usePlaylist } from "../Contexts/PlaylistContext";
import "./PlaylistMain.scss";
import FileUploader from "./file-uploader/FileUploader";
import MusicTable from "./music-table/MusicTable";

//TODO Remove honeycore from localstorage
//TODO if no playlist ID exists, create one
//can be achieved by checking local storage if playlistID is populated
//set state to conditionally render an EmptyPlaylist component that prompts you to create a playlist
//consider api call to create an empty playlist with a default name "New Playlist"

//File uploader will be used again inside of settings with more visible usage i.e. button and dragging.
const PlaylistMain: React.FC = () => {
  //Context hooks
  const { currentPlaylistId, currentPlaylistName } = usePlaylist();

  return (
    <div className="PlaylistMain">
      <FileUploader />

      {/* TODO update header formatting and add playlist icon */}
      <div className="playlistHeader">
        <h1>
          {currentPlaylistName}: {currentPlaylistId}
        </h1>
      </div>

      <div className="PlaylistTableContainer">
        <MusicTable currentPlaylistId={currentPlaylistId} />
      </div>

    </div>
  );
};

export default PlaylistMain;
