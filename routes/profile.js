var express = require('express');
var router = express.Router();

const {authenticateToken} = require('../config/token')

const moment = require('moment')

const userModel = require('../models/user')
const statusModel = require('../models/status')

router.get('/',authenticateToken,async (req, res, next) => {
    var {id} = req.query
    let mainUser = req.user
    let statusUser = await statusModel.find({user: id})
    if (id != req.user._id) {
        mainUser = await userModel.findById(id)
    }
    res.render('profile', {
        user: req.user,
        mainUser,
        statusUser,
        moment
    })
})
router.get("*",function (req, res, next) {
	res.render("notfound")
});
module.exports = router