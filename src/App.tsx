import React, { useState } from "react";
import "./App.css";
import InputField from "./components/InputField";
// import MusicList from "./components/MusicList";
import FileTest from "./components/FileTest";
import logo from "./logo.svg";

const App: React.FC = () => {
  const [searchIn, setSearchIn] = useState<string | number>("");

  console.log(searchIn);
  return (
    // Components called here
    <div className="App">
      <span className="heading">Music Player</span>
      <InputField searchIn={searchIn} setSearchIn={setSearchIn} />
      <FileTest/>
      hello.
    </div>
  );
};

export default App;
