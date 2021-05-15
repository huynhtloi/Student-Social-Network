const mongoose = require('mongoose')
const CommentSchema = mongoose.Schema({
    statusId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'status',
        require: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users',
        require: true,
    },
    content: {
        type: String,
        require: true,
    },
    dateModified: {
        type: Date,
        require: true,
    }
})
module.exports = mongoose.model('comments', CommentSchema)