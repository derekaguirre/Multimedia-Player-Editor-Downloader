//Handle api
const express = require("express");

//Handle database
const mongoose = require('mongoose');
//For handling files with the database
const multer = require("multer");

//Allows for access to resources between front and backend
const cors = require("cors");

//For handling files on posts
const bodyParser = require('body-parser');


const fs = require('fs');
const path = require('path');

const uploadDirectory = path.join(__dirname, 'uploads');
// console.log("********************SERVER DIRECTORY:", uploadDirectory);


const app = express();


//Raise the payload limit when posting
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));


// Enable CORS for all routes
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));


//CONNECTING TO DB------------
//mongodb://127.0.0.1:27017/
const databaseUrl = 'mongodb://127.0.0.1:27017/SongDB';

//API START

//-----------------------CONNECTING TO DB SECTION ----------------------
// Connect to MongoDB
mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully to MongoDB');
    // Perform database operations here
    
  })
  .catch(err => {
    console.error('Error occurred while connecting to MongoDB:', err);
  });

// Server setup
app.listen(4000, () => {
  console.log("The application is listening on port " + 4000);
});
//--------------------Import Models--------------------------------------
const FileModel = require('./models/FileModel');

//Retrieve a list of all the files
app.get('/files', async( req, res) => {
  const files = await FileModel.find();

  res.json(files);
})
//-------------------------------------------------------------------------

//-------------------PREV API DEFINITIONS----------------------------------
// Adding a new file entry to the database not using multer
// app.post('/files/new', async (req, res) => {
//   try {
//     const newFile = new FileModel({
//       fileName: req.body.fileName,
//       filePath: req.body.filePath,
//       fileSize: req.body.fileSize,
//       fileType: req.body.fileType
//     });

//     await newFile.save();

//     res.json(newFile);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

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

// const multi_upload = multer({
//   storage,
//   limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
//   fileFilter: (req, file, cb) => {
//       if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//           cb(null, true);
//       } else {
//           cb(null, false);
//           const err = new Error('Only .png, .jpg and .jpeg format allowed!')
//           err.name = 'ExtensionError'
//           return cb(err);
//       }
//   },
// }).array('uploadedFiles')

const upload = multer({ storage: storage });

// app.post('/files/new', (req, res) => {
//   multi_upload(req, res, function (err) {
//       if (err instanceof multer.MulterError) {
//           // A Multer error occurred when uploading.
//           res.status(500).send({ error: { message: `Multer uploading error: ${err.message}` } }).end();
//           return;
//       } else if (err) {
//           // An unknown error occurred when uploading.
//           if (err.name == 'ExtensionError') {
//               res.status(413).send({ error: { message: err.message } }).end();
//           } else {
//               res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
//           }
//           return;
//       }

//       // Everything went fine.
//       // show file `req.files`
//       // show body `req.body`
//       res.status(200).end('Your files uploaded.');
//   })
// });


app.post('/files/new', upload.array('uploadedFiles'), function(req, res) {
  var file = req.files;
  res.end();
});


// app.post('/files/new', upload.single('file_entry'), async (req, res) => {
//   try {
//   // Access the uploaded file using req.file
//   const uploadedFile = req.file;

//   // Print the upload directory
//   console.log('Upload directory:', uploadDirectory);

//   // Access other form fields using req.body
//   const fileName = req.body.fileName;
//   const filePath = req.body.filePath;
//   const fileSize = req.body.fileSize;
//   const fileType = req.body.fileType;

//   // Perform desired operations with the uploaded file and form fields
//     const newFile = new FileModel({
//       fileName: fileName,
//       filePath: filePath,
//       fileSize: fileSize,
//       fileType: fileType
//     });

//     await newFile.save();

//     res.json(newFile);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'File uploaded but the database didnt get updated' });
//   }

//   res.status(200).json({ message: 'File uploaded successfully!' });
// });


//newest upload
// app.post('/files/new', upload.single('file'), async (req, res) => {
//   try {
//     // Access the uploaded file using req.file
//     const uploadedFile = req.file;

//     // Access other form fields using req.body
//     const fileName = req.body.fileName;
//     const filePath = req.file.path; // Use the uploaded file's path
//     const fileSize = req.body.fileSize;
//     const fileType = req.body.fileType;

//     // Perform desired operations with the uploaded file and form fields

//     // Create a new file entry using the File model
//     const newFile = new File({
//       fileName,
//       filePath,
//       fileSize,
//       fileType
//     });

//     // Save the new file entry to the database
//     await newFile.save();

//     res.status(200).json({ message: 'File uploaded successfully!', file: newFile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

//Handles uploading files to the database
// app.post("/upload", upload.single("file"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }
//   // Access the uploaded file via req.file
//   console.log(req.file);
//   // Process the uploaded file or save its information to the database

//   // Return a response
//   res.status(200).json({ message: "File uploaded successfully" });
// });


//Adding new entries to DB using multer
// app.post('/files/new', upload.single('file'), (req, res) => {
//   // Access the uploaded file using req.file
//   const uploadedFile = req.file;

//   // Print the upload directory
//   console.log('Upload directory:', uploadDirectory);

//   // Access other form fields using req.body
//   const fileName = req.body.fileName;
//   const filePath = req.body.filePath;
//   const fileSize = req.body.fileSize;
//   const fileType = req.body.fileType;

//   // Perform desired operations with the uploaded file and form fields

//   res.status(200).json({ message: 'File uploaded successfully!' });
// });

// app.post('/files/new', upload.array('files'), function (req, res, next) {
//   const uploadedFiles = req.file;
//   console.log('Upload directory:', uploadDirectory,"\\",uploadedFiles);

//   // req.files is array of `photos` files
//   // req.body will contain the text fields, if there were any
//   res.status(200).json({ message: 'File uploaded successfully!' });
// })



//--------------------------------------------------