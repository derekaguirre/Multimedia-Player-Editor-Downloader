import React from "react";
import "./PlaylistMain.scss";
import FileUploader from "./file-uploader/FileUploader";
import MusicTable from "./music-table/MusicTable";

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
