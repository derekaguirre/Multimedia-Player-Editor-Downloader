import React, { useState } from "react";
import "./App.css";
import FileTest from "./components/FileTest";
import InputField from "./components/InputField";

const App: React.FC = () => {
  const [searchIn, setSearchIn] = useState<string | number>("");

  console.log(searchIn);
  return (
    // Components called here
    <div className="App">
      <span className="heading">Music Player</span>
      <InputField searchIn={searchIn} setSearchIn={setSearchIn} />
      <FileTest/>
      
    </div>
  );
};

export default App;
