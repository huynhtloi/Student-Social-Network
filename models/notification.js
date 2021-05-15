const mongoose = require('mongoose')
const notificationSchema = mongoose.Schema({
    createAt: {
        require: true,
        type: Number
    },
    title:{
        require: true,
        type: String
    },
    content:{
        require: true,
        type: String
    },
    department:{
        require: true,
        type: String
    },
    author:{
        require: true,
        type: String
    },
})
module.exports = mongoose.model('notification', notificationSchema)