import React from 'react';
import './PlaylistMain.scss';
import FileUploader from './file-uploader/FileUploader';
import MusicTable from './music-table/MusicTable';

function PlaylistMain() {
  return (
    <div className="PlaylistMain">
      
      <FileUploader />
      <MusicTable />
    </div>
  );
}

export default PlaylistMain;