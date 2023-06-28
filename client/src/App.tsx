import React, { useState } from "react";
import "./App.css";
import FileUploader from "./components/PlaylistPages/FileUploader";
import InputField from "./components/PlaylistPages/InputField";
import SongList from "./components/PlaylistPages/SongList";

const App: React.FC = () => {
  const [searchIn, setSearchIn] = useState<string | number>("");

  return (
    <div className="App">
      <span className="heading">Music Player</span>
      <InputField searchIn={searchIn} setSearchIn={setSearchIn} />
      <FileUploader/>
      <SongList />
    </div>
  );
};

export default App;