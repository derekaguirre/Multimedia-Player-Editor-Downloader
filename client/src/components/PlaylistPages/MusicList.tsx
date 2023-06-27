// import * as fs from "fs";
// import * as path from "path";
// import React, { useEffect, useState } from "react";

// const MusicList: React.FC = () => {
//   const [musicFiles, setMusicFiles] = useState<string[]>([]);

//   useEffect(() => {
//     const loadMusicFiles = async () => {
//       try {
//         // path to files
//         const musicFolder = path.join(__dirname, "C:\\Users\\derek\\Music\\Music");
//         const files = await fs.promises.readdir(musicFolder);
//         setMusicFiles(files);
//       } catch (error) {
//         console.error("There was an issue locating the folder", error);
//       }
//     };

//     loadMusicFiles();
//   }, []);

//   return (
//     <div>
//       <h1>Music List</h1>
//       <ul>
//         {musicFiles.map((file, index) => (
//           <li key={index}>{file}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MusicList;

export { };

