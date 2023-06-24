// Importing module
// run with nodemon index.js
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const express = require("express");

const app = express();
const cors = require("cors");

app.use(cors());
const mongoose = require('mongoose');


//API START

//DB SECTION -----------------------------------
// Connect to MongoDB
const databaseUrl = 'mongodb://localhost:27017/mydatabase';
mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully to MongoDB');
    
    // Perform database operations here
    
  })
  .catch(err => {
    console.error('Error occurred while connecting to MongoDB:', err);
  });



  const Schema = mongoose.Schema;

  const userSchema = new Schema({
    name: String,
    age: Number
  });
  
  const User = mongoose.model('User', userSchema);
//using schema 
  const newUser = new User({
    name: 'John',
    age: 25
  });
  
  newUser.save()
    .then(() => {
      console.log('User created successfully');
    })
    .catch(err => {
      console.error('Error occurred while creating user:', err);
    });

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

app.delete("/upload", (req, res) => {
  console.log("file deleted");
  return res.status(200).json({ result: true, msg: "file deleted" });
});

// Handling GET / Request
app.get("/test", (req, res) => {
  res.json('test ok4');
});

// Server setup
app.listen(4000, () => {
  console.log("The application is listening on port " + 4000);
});
