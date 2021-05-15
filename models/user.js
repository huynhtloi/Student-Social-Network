const mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');
var crypto = require('crypto');
const UserSchema = mongoose.Schema({
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
	faculty: {
		type: String,
	},
	major: {
		type: String,
	},
	birth: {
		type: Date,
	},
	gender: {
		type: String,
	},
	phone: {
		type: String,
	},
	address: {
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
	},


})

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('users', UserSchema)