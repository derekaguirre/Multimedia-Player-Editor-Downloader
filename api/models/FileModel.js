const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileNameOriginal: {
      type: String,
      required: true,
    },
    fileNameFormatted: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: false,
    },
    fileSize: {
      type: Number,
      required: false,
    },
    fileType: {
      type: String,
      required: false,
    },
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;