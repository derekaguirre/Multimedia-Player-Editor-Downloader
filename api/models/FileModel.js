const mongoose = require('mongoose');
/*

 <td>{file.fileName}</td>
              <td>{file.filePath}</td>
              <td>{file.fileSize}</td>
              <td>{file.fileType}</td>

*/

const fileSchema = new mongoose.Schema({
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: false,
    },
    fileType: {
      type: String,
      required: true,
    },
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;