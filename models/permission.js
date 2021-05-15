const mongoose = require('mongoose')
const permissionSchema = mongoose.Schema({
    maphong:{
        require: true,
        type: String,
    },
    department:{
        require: true,
        type: Array,
    }
})
module.exports = mongoose.model('permission', permissionSchema)