// run with nodemon server.js

// Importing module
// const fs = require('fs');
// const axios = require('axios');
// const FormData = require('form-data');

//Handle api
const express = require("express");

//Handle database
const mongoose = require('mongoose');

//Allows for access to resources between front and backend
const cors = require("cors");


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));


//CONNECTING TO DB------------
//mongodb://127.0.0.1:27017/
const databaseUrl = 'mongodb://127.0.0.1:27017/SongDB';

//API START

//DB SECTION -----------------------------------
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

//Import Models
const FileModel = require('./models/FileModel');

//Retrieve a list of all the files
app.get('/files', async( req, res) => {
  const files = await FileModel.find();

  res.json(files);
})
//Adding a new file entry to the database
app.post('/files/new', async (req, res) => {
  try {
    const newFile = new FileModel({
      fileName: req.body.text
    });

    await newFile.save();

    res.json(newFile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Adding a new file entry to the database
app.delete("/files/:id", function(req, res) {
  var File = getTodoById(parseInt(req.params.id));
  if (todo) {
    removeTodo(parseInt(req.params.id));
    res.send("ok");
  } else {
    res.status(400).send("record not found");
  }
});
//Delete specific project by id
app.delete('/files/delete/:id', async (req, res) => {
	const result = await FileModel.findByIdAndDelete(req.params.id);
	res.json({result});
});

//FURTHER API documentation for future implementation
//https://expressjs.com/en/api.html#routing-methods
app.put('files/complete/:id', async(req, res)=>{
  const result = await FileModel.findby
})


//------------------------------------

//Temporary Non-Functional API
//Future implementation will need file reading
app.post("/upload", (req, res) => {
  // use modules such as express-fileupload, Multer, Busboy

  setTimeout(() => {
    console.log("file uploaded");
    return res.status(200).json({ result: true, msg: "file uploaded" });
  }, 4000);
});

// app.delete("/upload", (req, res) => {
//   console.log("file deleted");
//   return res.status(200).json({ result: true, msg: "file deleted" });
// });

// Handling GET / Request
// app.get("/test", (req, res) => {
//   res.json('test ok4');
// });


