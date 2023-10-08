//API calls will be using express
const express = require("express");
const app = express();

//For handling files in the backend and its dependencies
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const uploadDirectory = path.join(__dirname, "uploads");

//For handling files on posts and raising the post limit
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
//prettier-ignore
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 1000000,})
);

//Allows for access to resources between front and backend and opens CORs for all routes
const cors = require("cors");
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  //prettier-ignore
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

//-----------------------CONNECTING TO DB SECTION ----------------------
//Database connection and calls will be using mongoose
const mongoose = require("mongoose");

// Connect to MongoDB
const databaseUrl = "mongodb://127.0.0.1:27017/SongDB";

mongoose
  .connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  //prettier-ignore
  .then(() => {
    console.log("Connected successfully to MongoDB");
    // Perform database operations here
  })
  .catch((err) => {
    console.error("Error occurred while connecting to MongoDB:", err);
  });

// On port
app.listen(4000, () => {
  console.log("The application is listening on port " + 4000);
});

//-------------------------------------------------------------------------
//API START

//----------------MULTER IMPLEMENTATION------------------

// Create the upload directory if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

//Defining the multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename for the uploaded file
  },
});

// Creating an instance of multer
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filePath = path.join(uploadDirectory, file.originalname);
    if (fs.existsSync(filePath)) {
      console.log("Duplicate file detected, skipping: ", file.originalname);
      cb(null, false); // Ignore the duplicate file
    } else {
      cb(null, true); // Accept the new file
    }
  },
});

//Stores a copy of the file on local system using multer
//prettier-ignore
app.post("/playlist/new-file", upload.array("uploadedFiles"), function (req, res) {
  res.end();
});

//Allows serving files from the uploads folder
app.use("/uploads", express.static("uploads"));

//--------------------------------------------------

//-------------------MONGO IMPLEMENTATIONS----------------------------------
//Import model file(s)
const PlaylistModel = require("./models/PlaylistSchema");

// Fetch all songs in a playlist
app.get("/playlist/:id/songs", async (req, res) => {
  try {
    const playlistId = req.params.id;
    console.log("Server playlist ID: ", playlistId);
    // Find the playlist by ID
    const playlist = await PlaylistModel.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Return the songs in the playlist
    res.status(200).json(playlist.songs);
    // console.log("SERV SONG BODY", playlist.songs);
  } catch (error) {
    console.error("Error getting songs from playlist:", error);
    res.status(500).json({ error: "Failed to get songs from playlist" });
  }
});
// Fetch all playlist names and IDs
app.get("/playlist/names", async (req, res) => {
  try {
    console.log("Server fetching playlist names/ids");
    const playlists = await PlaylistModel.find({}, "_id name");
    res.json(playlists);
  } catch (error) {
    console.error("Error fetching playlist names:", error);
    res.status(500).json({ error: "Failed to fetch playlist names" });
  }
});

// Route to fetch the image buffer for a song by its ID
app.get("/songs/:id/image", async (req, res) => {
  try {
    const songId = req.params.id;
    // Validate that the provided songId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ error: "Invalid song ID" });
    }

    // Find the song by its ID
    const song = await PlaylistModel.findOne({ "songs._id": songId }, { "songs.$": 1 });
    // console.log("SONG", song)
    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Respond with the 'image' field of the song document
    const imageBuffer = song.songs[0].image[0].imageBuffer;
    res.send(imageBuffer);
  } catch (error) {
    console.error("Error fetching song image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Stores file metadata using mongodb
// app.post("/files/new-metadata", async (req, res) => {
//   const { metadataArray } = req.body;
//   console.log("SERVER BODY", metadataArray);

//   try {
//     // Create an array of file metadata documents
//     const fileMetadataArray = metadataArray.map((metadata) => ({
//       fileNameOriginal: metadata.fileNameOriginal,
//       fileNameFormatted: metadata.fileNameFormatted,
//       fileSize: metadata.fileSize,
//       fileType: metadata.fileType,
//       filePath: uploadDirectory + "\\" + metadata.fileNameOriginal,
//     }));

//     // Insert the file metadata documents into the database
//     await SongModel.insertMany(fileMetadataArray);

//     // Send a response
//     res.status(200).send("File names stored successfully");
//   } catch (error) {
//     console.error("Error storing file names:", error);
//     res.status(500).send("Error storing file names");
//   }
// });

//Create a new empty playlist
app.post("/files/new-playlist", async (req, res) => {
  try {
    const playlistData = req.body;
    const playlist = await PlaylistModel.create(playlistData);
    res.status(201).json(playlist);
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ error: "Failed to create playlist" });
  }
});

// ---------------------node-id3--------------------------------
const NodeID3 = require("node-id3"); //Library for parsing songs

// Add NEW Songs to specific playlist with a given id
app.post("/playlist/:id/add-songs", async (req, res) => {
  try {
    const playlistId = req.params.id;
    const metadataArray = req.body.metadataArray;

    // console.log("PLAYLIST ID", playlistId);
    // console.log("SERVER BODY", metadataArray);

    // Find the playlist by ID
    const playlist = await PlaylistModel.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Extract the file paths from metadataArray
    for (const metadata of metadataArray) {
      // Check if the song already exists in the playlist
      const isDuplicate = playlist.songs.some(
        (song) => song.fileNameOriginal === metadata.fileNameOriginal
      );

      if (isDuplicate) {
        //prettier-ignore
        console.log("Duplicate song found, skipping:",metadata.fileNameOriginal);

        continue;
      }

      //Set the file path and read the tags
      const filePath = `${uploadDirectory}\\${metadata.fileNameOriginal}`;

      const tags = NodeID3.read(filePath);

      // console.log("IMAGE BEFORE PROCESSING", tags.image.type.name);
      const imageDataArr = {
        mime: tags.image.mime || " ",
        imageType: {
          imageId: tags.image.type.id || 0,
          imageName: tags.image.type.name || " ",
        },
        imageDescription: tags.image.description || " ",
        imageBuffer: tags.image.imageBuffer || Buffer.alloc(0),
      };
      //Create the song object with extracted metadata
      //'metadata' comes from the front end
      const fullSongMetadata = {
        fileNameOriginal: metadata.fileNameOriginal,
        fileNameFormatted: metadata.fileNameFormatted,
        fileSize: metadata.fileSize,
        fileType: metadata.fileType,
        filePath: filePath,
        dateAdded: new Date(),
        isVisible: true,
        isLiked: false,
        title: metadata.title,
        duration: metadata.duration || "",
        artist: tags.artist || "",
        album: tags.album || "",
        genre: tags.genre || "",
        image: imageDataArr,
      };

      //Add the song to the playlist's songs array
      playlist.songs.push(fullSongMetadata);
    }
    // Save the updated playlist
    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    console.error("Error adding songs to playlist:", error);
    res.status(500).json({ error: "Failed to add songs to playlist" });
  }
});

//Delete specific playlist by id
app.delete("/files/delete/:id", async (req, res) => {
  const result = await SongModel.findByIdAndDelete(req.params.id);
  res.json({ result });
});

//-------------------------------------------------------------------------------

//FURTHER API documentation for future implementation: https://expressjs.com/en/api.html#routing-methods
//------------------------------------------------------------------------------

//Like a song
//Hide a song
//Delete a song in a playlist
//Adding an image to a playlist
//Playlist description changing
//Change playlist name
//Update/set song metadata
//Update file name
//Get a picture MAYBE
//Update picture
//GET by song id and/or song name
