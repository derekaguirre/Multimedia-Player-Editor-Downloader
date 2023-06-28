//API calls will be using express
const express = require("express");
const app = express();

//For handling files in the backend and its dependencies
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const uploadDirectory = path.join(__dirname, 'uploads');

//For handling files on posts and raising the post limit
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));


//Allows for access to resources between front and backend and opens CORs for all routes
const cors = require("cors");
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));



//-----------------------CONNECTING TO DB SECTION ----------------------
//Database connection and calls will be using mongoose
const mongoose = require('mongoose');

// Connect to MongoDB
const databaseUrl = 'mongodb://127.0.0.1:27017/SongDB';

mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully to MongoDB');
    // Perform database operations here
    
  })
  .catch(err => {
    console.error('Error occurred while connecting to MongoDB:', err);
  });

// On port
app.listen(4000, () => {
  console.log("The application is listening on port " + 4000);
});



//-------------------------------------------------------------------------

//API START
//-------------------MONGO IMPLEMENTATIONS----------------------------------
//Import model file(s)
// const SongModel = require('./models/SongSchema');
const PlaylistModel = require('./models/PlaylistSchema');
const Playlist = require("./models/PlaylistSchema");
// const ObjectId = mongoose.Types.ObjectId;

// fileNameOriginal: metadata.fileNameOriginal,
//       fileNameFormatted: metadata.fileNameFormatted,
//       fileSize: metadata.fileSize,
//       fileType: metadata.fileType,
//       filePath: `${uploadDirectory}\\${metadata.fileNameOriginal}`,
//Retrieve a list of all the files
// Get all songs in a playlist
app.get('/playlist/:id/songs', async (req, res) => {
  try {
    const playlistId = req.params.id;
    console.log("CHECKING GET", playlistId);
    // Find the playlist by ID
    const playlist = await PlaylistModel.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Return the songs in the playlist
    res.status(200).json(playlist.songs);
    // console.log("CHECKING BODY", playlist.songs);

  } catch (error) {
    console.error('Error getting songs from playlist:', error);
    res.status(500).json({ error: 'Failed to get songs from playlist' });
  }
});


//Stores file metadata using mongodb
app.post('/files/new-metadata', async (req, res) => {
  const { metadataArray } = req.body;
  console.log("SERVER BODY", metadataArray);
  
  try {
    // Create an array of file metadata documents
    const fileMetadataArray = metadataArray.map((metadata) => ({
      fileNameOriginal: metadata.fileNameOriginal,
      fileNameFormatted: metadata.fileNameFormatted,
      fileSize: metadata.fileSize,
      fileType: metadata.fileType,
      filePath: uploadDirectory+"\\"+metadata.fileNameOriginal,
    }));

    // Insert the file metadata documents into the database
    await SongModel.insertMany(fileMetadataArray);

    // Send a response
    res.status(200).send("File names stored successfully");
  } catch (error) {
    console.error("Error storing file names:", error);
    res.status(500).send("Error storing file names");
  }
});

app.post('/files/new-playlist', async (req, res) => {
  try {
    const playlistData = req.body;
    const playlist = await PlaylistModel.create(playlistData);
    res.status(201).json(playlist);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});


// Add Songs to specific playlist with a given id
app.post('/playlist/:id/add-songs', async (req, res) => {
  try {
    const playlistId = req.params.id;
    const metadataArray = req.body.metadataArray;
    console.log("PLAYLIST ID", playlistId);
    console.log("SERVER BODY", metadataArray);


    // Find the playlist by ID
    const playlist = await PlaylistModel.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Create an array of all the metadata in the body
    const fileMetadataArray = metadataArray.map((metadata) => ({
      fileNameOriginal: metadata.fileNameOriginal,
      fileNameFormatted: metadata.fileNameFormatted,
      fileSize: metadata.fileSize,
      fileType: metadata.fileType,
      filePath: `${uploadDirectory}\\${metadata.fileNameOriginal}`,
    }));

    // Add the song documents to the playlist's songs array
    playlist.songs.push(...fileMetadataArray);

    // Save the updated playlist
    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    console.error('Error adding songs to playlist:', error);
    res.status(500).json({ error: 'Failed to add songs to playlist' });
  }
});




//Delete specific project by id
app.delete('/files/delete/:id', async (req, res) => {
	const result = await SongModel.findByIdAndDelete(req.params.id);
	res.json({result});
});


//---------------------node-id3--------------------------------

// const NodeID3 = require('node-id3');
// const Playlist = require("./models/PlaylistSchema");

// const filePath = 'E:\\GitHub Projects\\Multimedia Player-Editor-Downloader\\api\\uploads\\Coloring.mp3';

// // Read the metadata from the MP3 file
// const tags = NodeID3.read(filePath);

// // Extract desired metadata properties
// const title = tags.title;
// const artist = tags.artist;
// const album = tags.album;
// const genre = tags.genre;

// console.log('Title:', title);
// console.log('Artist:', artist);
// console.log('Album:', album);
// console.log('Genre:', genre);

//-------------------------------------------------------------------------------



//FURTHER API documentation for future implementation: https://expressjs.com/en/api.html#routing-methods
//------------------------------------------------------------------------------





//----------------MULTER IMPLEMENTATION------------------


// Create the upload directory if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

//Defining the multer storage configuration and creating an instance
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename for the uploaded file
  },
});
const upload = multer({ storage: storage });


//Stores a copy of the file on local system using multer
app.post('/files/new', upload.array('uploadedFiles'), function(req, res) {
  var file = req.files;
  // var fileName = req.name;
  // console.log("filenameServer**: ",fileName);
  res.end();
});

//Allows serving files from the uploads folder
app.use('/uploads', express.static('uploads'));

//--------------------------------------------------