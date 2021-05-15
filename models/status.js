const mongoose = require('mongoose')
const StatusSchema = mongoose.Schema({
    statusId: {
        type: String,
        require: true,
    },
    user : {
        type: mongoose.Schema.Types.ObjectId, ref: 'users',
        require: true
    },
    like: {
        type: String,
    },
    statusTitle: {
        type: String,
        require: true,
    },
    dateModified: {
        type: Date,
        require: true,
    },
    image: {
        type: String,
    },
    video: {
        type: String,
    }
})
module.exports = mongoose.model('status', StatusSchema)