const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    fileName: {
        type: String,
        required: true,
    },
    timestamp: {
        type: String,
        default: Date.now()
    }
    // eventDate: {
    //     type: Date,
    //     required: true
    // },
    // analystInitials: {
    //     type: String,
    //     required: true
    // },
    // canConnectorID: {
	// 	type: Number,
	// 	required: true
	// },
    // vehicleID: {
    //     type: Number,
    //     required: true
    // },
    // baudRate: {
    //     type: Number,
    // },
    // dbcFileName: {
    //     type: String,
    //     required: true
    // },
    // blacklistFileName: {
    //     type: String
    // },
    // sessionRef: {
    //     type: Schema.Types.ObjectId, ref: "Project"
    // },
    
});

//Export Model
const FileModel = mongoose.model("Files", FileSchema);
module.exports = FileModel;