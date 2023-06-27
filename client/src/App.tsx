import React, { useState } from "react";
import "./App.css";
import FilePicker from "./components/PlaylistPages/FilePicker";
import InputField from "./components/PlaylistPages/InputField";
import SongList from "./components/PlaylistPages/SongList";

const App: React.FC = () => {
  const [searchIn, setSearchIn] = useState<string | number>("");

  console.log(searchIn);

  return (
    <div className="App">
      <span className="heading">Music Player</span>
      <InputField searchIn={searchIn} setSearchIn={setSearchIn} />
      <FilePicker/>
      <SongList />
    </div>
  );
};

export default App;