import React, { useState } from "react";
import "./App.css";
import FolderSelector from "./components/FolderSelector";
import InputField from "./components/InputField";
import { default as SongList } from "./components/SongList";

const App: React.FC = () => {
  const [searchIn, setSearchIn] = useState<string | number>("");

  console.log(searchIn);

  return (
    <div className="App">
      <span className="heading">Music Player</span>
      <InputField searchIn={searchIn} setSearchIn={setSearchIn} />
      <FolderSelector/>
      <SongList />
    </div>
  );
};

export default App;