const mongoose = require('mongoose')
const StudentSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  type: {
    type: String,
    required: true,
	},
	username: {
		type: String,
	  	required: true,
	},
	password: {
		type: String,
	  required: true,
	}
    
})
module.exports = mongoose.model('students', StudentSchema)