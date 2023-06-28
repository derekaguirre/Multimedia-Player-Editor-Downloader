const mongoose = require('mongoose');

const playListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  songs: [
    {
      fileNameOriginal: {
        type: String,
        required: false,
      },
      fileNameFormatted: {
        type: String,
        required: false,
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
    }
  ],
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
});

const Playlist = mongoose.model('Playlist', playListSchema);

module.exports = Playlist;