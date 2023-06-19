// Importing module
// run with nodemon index.js
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const express = require("express");

const app = express();
const cors = require("cors");

app.use(cors());

//Temporary Non-Functional API
//Future implementation will need file reading
app.post("/upload", (req, res) => {
  // use modules such as express-fileupload, Multer, Busboy

  setTimeout(() => {
    console.log("file uploaded");
    return res.status(200).json({ result: true, msg: "file uploaded" });
  }, 3000);
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
