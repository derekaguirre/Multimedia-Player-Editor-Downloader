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
const FileModel = require('./models/FileModel');

//Retrieve a list of all the files
app.get('/files', async( req, res) => {
  const files = await FileModel.find();

  res.json(files);
})

//Stores file metadata using mongodb
app.post('/files/new-metadata', async (req, res) => {
  const { metadataArray } = req.body; // Destructure the correct property
  console.log("SERVER BODY", metadataArray);
  
  try {
    // Create an array of file metadata documents
    const fileMetadataArray = metadataArray.map((metadata) => ({
      fileNameOriginal: metadata.fileNameOriginal,
      fileNameFormatted: metadata.fileNameFormatted,
      filePath: uploadDirectory+"\\"+metadata.fileNameOriginal,
      fileSize: metadata.fileSize,
      fileType: metadata.fileType,
    }));

    // Insert the file metadata documents into the database
    await FileModel.insertMany(fileMetadataArray);

    // Send a response
    res.status(200).send("File names stored successfully");
  } catch (error) {
    console.error("Error storing file names:", error);
    res.status(500).send("Error storing file names");
  }
});

//Delete specific project by id
app.delete('/files/delete/:id', async (req, res) => {
	const result = await FileModel.findByIdAndDelete(req.params.id);
	res.json({result});
});

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