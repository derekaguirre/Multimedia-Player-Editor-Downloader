import React from "react";
import "./PlaylistMain.scss";
import FileUploader from "./file-uploader/FileUploader";
import MusicTable from "./music-table/MusicTable";
const API_URL = "http://localhost:4000";

//TODO if no playlist ID exists, create one
//can be achieved by checking local storage if playlistID is populated
console.log("checking local storage:")

// if()
console.log(localStorage)
//if not, then call api to create an empty playlist with a default name "New Playlist"
//TODO store playlist id in local storage
//TODO Remove honeycore from localstorage
const textFromStorage = localStorage.getItem('my-key');

//Pass current playlist name here consider refactoring musictable into here if overhead too large
//Pass fileuploader to encompass the whole page and only accept drops
//File uploader will be used again inside of settings with more visible usage i.e. button and dragging.
function PlaylistMain() {
  return (
    <div className="PlaylistMain">
      {/* <FileUploader /> */}
      <div className="header">
        <h1>PlaylistMain Header</h1>
      </div>
      <div className="PlaylistTableContainer">
        <MusicTable />
      </div>
    </div>
  );
}

export default PlaylistMain;
