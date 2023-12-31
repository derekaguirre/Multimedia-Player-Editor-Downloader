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

// Fetch song image buffer from song ID
app.get("/songs/:id/image", async (req, res) => {
  try {
    const songId = req.params.id;
    // Validate that the provided songId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ error: "Invalid song ID" });
    }

    // Find the song by its ID
    const song = await PlaylistModel.findOne(
      { "songs._id": songId },
      { "songs.$": 1 }
    );
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
    // console.log("BODY FROM CLIENT", metadataArray);

    // Find the playlist by ID
    const playlist = await PlaylistModel.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Extract the file paths from metadataArray
    for (const metadata of metadataArray) {
      // Check if the song already exists in the playlist
      //prettier-ignore
      const isDuplicate = playlist.songs.some((song) => song.fileNameOriginal === metadata.fileNameOriginal);
      if (isDuplicate) {
        //prettier-ignore
        console.log("Duplicate song found, skipping:",metadata.fileNameOriginal);
        continue;
      }
      //Set the file path and read the tags
      const filePath = `${uploadDirectory}\\${metadata.fileNameOriginal}`;
      const tags = NodeID3.read(filePath);
      let imageDataArr = {
        mime: "",
        imageType: {
          imageId: 0,
          imageName: "",
        },
        imageDescription: "",
        imageBuffer: "",
      };

      if (tags.image) {
        console.log("IMAGE BEFORE PROCESSING", tags.image.type.name);
        imageDataArr = {
          mime: tags.image.mime,
          imageType: {
            imageId: tags.image.type.id,
            imageName: tags.image.type.name,
          },
          imageDescription: tags.image.description,
          imageBuffer: tags.image.imageBuffer
            ? tags.image.imageBuffer.toString("base64")
            : "",
        };
      }

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
        title: tags.title === undefined ? metadata.title : tags.title,
        duration: metadata.duration || "",
        artist: tags.artist || "",
        album: tags.album || "",
        genre: tags.genre || "",
        image: imageDataArr,
      };

      //Add the song to the playlist's songs array
      // console.log("UPLOADING: ", fullSongMetadata)
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

// Update a song by its ID
app.put("/songs/:id/edit", upload.none(), async (req, res) => {
  try {
    const songId = req.params.id;
    const frontData = req.body.frontData;

    // Validate that the provided songId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ error: "Invalid song ID" });
    }

    // Find the song by its ID
    const song = await PlaylistModel.findOne({ "songs._id": songId });
    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Find and update the specific song within the playlist
    const currSong = song.songs.find((s) => s._id.toString() === songId);
    if (!currSong) {
      return res.status(404).json({ error: "Song not found in playlist" });
    }

    // Verify that all fields are not empty
    //prettier-ignore
    for (const key in frontData) {
      if (frontData[key] == undefined ||frontData[key] == null ||frontData[key] == "") {
        return res.status(400).json({ error: "Please fill out all fields" });
      }
    }
    // Instantiate path variables
    const newFilePath = path.join(uploadDirectory, `${frontData.title}.mp3`);

    // Prevent overwriting of the prev song, unless the song entry was the original holder of the title
    //prettier-ignore
    if (path.basename(currSong.filePath) != `${frontData.title}.mp3` && fs.existsSync(newFilePath)) {
      return res.status(400).json({ error: "Song already exists, please input a unique name." });
    }

    // Use old name to find the file to rename with the new name
    fs.rename(currSong.filePath, newFilePath, (error) => {
      if (error) {
        console.error("Error renaming file:", error);
      }
    });

    // Update the tags in the actual file
    const audioFilePath = newFilePath; // Using the new file path
    const id3Tags = {
      title: frontData.title,
      artist: frontData.artist,
      album: frontData.album,
    };
    NodeID3.write(id3Tags, audioFilePath, function (error, buffer) {
      if (error) {
        console.error("Error writing ID3 tags:", error);
      } else {
        console.log("ID3 tags have been successfully written to the file.");
      }
    });

    // Update mongo metadata entries
    currSong.title = frontData.title;
    currSong.artist = frontData.artist;
    currSong.album = frontData.album;
    currSong.fileNameOriginal = `${frontData.title}.mp3`;
    currSong.fileNameFormatted = `${frontData.fileNameFormatted}.mp3`;
    currSong.filePath = `${uploadDirectory}\\${frontData.title}.mp3`;

    //Verify image is not empty before updating
    //prettier-ignore
    if (frontData.image.imageBuffer != "" &&frontData.image.imageBuffer != null &&frontData.image.imageBuffer != undefined) {
      currSong.image[0].imageBuffer = frontData.image.imageBuffer;
      currSong.image[0].mime = frontData.image.mime;
    }
    // Save the changes to the song
    await song.save();
    res.status(200).json(currSong);
  } catch (error) {
    console.error("Unexpected error encountered when editing the song:", error);
    return res.status(500).json({ error: "Failed to update song" });
  }
});

// Delete SONG by ID
app.delete("/songs/:id/delete", async (req, res) => {
  try {
    const songId = req.params.id;
    console.log("SONG ID", songId);

    // Validate that the provided songId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(songId))
      return res.status(400).json({ error: "Invalid song ID" });

    // Find the song by its ID
    const song = await PlaylistModel.findOne({ "songs._id": songId });
    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Remove the song from the array of songs
    song.songs = song.songs.filter((s) => s._id.toString() !== songId);

    // Save the changes to the playlist
    await song.save();

    console.log("Song deleted successfully");
    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.log("Error deleting song:", error);
    console.error("Error deleting song:", error);
    res.status(500).json({ error: "Failed to delete song" });
  }
});

// Delete PLAYLIST by ID
app.delete("/files/delete/:id", async (req, res) => {
  const result = await SongModel.findByIdAndDelete(req.params.id);
  res.json({ result });
});

//-------------------------------------------------------------------------------

//FURTHER API documentation for future implementation: https://expressjs.com/en/api.html#routing-methods
//------------------------------------------------------------------------------

//Like a song
//Hide a song
//Delete a song in a playlist (along with file)
//Adding an image to a playlist
//Add/Edit description of playlists
//Change playlist name
//Update/set song metadata
//Update file name
//Update picture
