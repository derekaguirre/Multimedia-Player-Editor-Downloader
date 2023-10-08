const mongoose = require("mongoose");
const date = new Date();

const playListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  songs: [
    {
      fileNameOriginal: {
        type: String,
      },
      fileNameFormatted: {
        type: String,
      },
      fileSize: {
        type: Number,
      },
      fileType: {
        type: String,
      },
      filePath: {
        type: String,
      },
      dateAdded: {
        type: Date,
      },
      isVisible: {
        type: Boolean,
        default: true,
      },
      isLiked: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
      },
      duration: {
        type: Number,
      },
      artist: {
        type: String,
      },
      album: {
        type: String,
      },
      genre: {
        type: String,
      },
      image: [
        {
          mime: {
            type: String,
          },
          imageType: [
            {
              imageId: {
                type: Number,
              },
              imageName: {
                type: String,
              },
            },
          ],
          imageDescription: {
            type: String,
          },
          imageBuffer: {
            type: String,
          },
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
          },
        },
      ],
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
      },
    },
  ],
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
});

const Playlist = mongoose.model("Playlist", playListSchema);

module.exports = Playlist;
