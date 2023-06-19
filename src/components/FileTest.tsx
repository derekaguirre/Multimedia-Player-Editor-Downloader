import React from "react";
// import preval from 'babel-plugin-preval/macro'

function FileTest() {
  const handleClick = () => {
    console.log("test");
  };
  return (
    <div>
      <button onClick={() => handleClick()} style={{ fontSize: "30px" }}>
        Test Files
      </button>
    </div>
  );
}
export default FileTest;
