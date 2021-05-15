const mongoose = require('mongoose')
const readSchema = mongoose.Schema({
    userId:{
        require: true,
        type: String,
    },
    notificationId:{
        require: true,
        type: Array,
    }
})
module.exports = mongoose.model('read', readSchema)