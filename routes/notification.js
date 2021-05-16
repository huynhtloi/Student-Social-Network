var express = require("express");
const createError = require("http-errors");
const notification = require("../models/notification");
const Permission = require("../models/permission");
var router = express.Router();
const User = require("../models/user");
const fetch = require("node-fetch");
const {authenticateToken} = require("../config/token")
/* GET login page. */
router.get("/",authenticateToken, async function (req, res, next) {
	
	
	let department = await User.find({
		$and: [
			{
				type: {
					$ne: "admin",
				},
			},
			{
				type: {
					$ne: "student",
				},
			},
		],
	});

	res.render("notificationPage", {
		user: req.user,
		department: department,
	});
});


router.get("/:id",authenticateToken, async function (req, res, next) {
	let maphong = req.params.id;
	if (maphong === "admin" || maphong === "student") {
		return res.render("notfound")
	}
	let phong = await User.findOne({
		type: maphong,
	});
	if (phong === null) {
		return res.render("notfound")
	}
	let department = await User.find({
		$and: [
			{
				type: {
					$ne: "admin",
				},
			},
			{
				type: {
					$ne: "student",
				},
			},
		],
	});
	
	let permissionToAdd = await Permission.findOne({
		maphong: req.user.type,
	});
	let isAdd = false;
	if (
		permissionToAdd != null &&
		permissionToAdd.department.includes(maphong)
	) {
		isAdd = true;
	} else {
		isAdd = false;
	}

	return res.render("notificationPage", {
		user: req.user,
		departmentName: phong,
		department: department,
		isAdd: isAdd,
		maphong:maphong
	});
});

router.get("/:maphong/:id",authenticateToken, async function (req, res, next) {
	let {maphong, id} = req.params
	if (maphong === "admin" || maphong === "student") {
		res.render("notfound")
	}
	let phong = await User.findOne({
		type: maphong,
	});
	if (phong === null) {
		return res.render("notfound")
	}
	let data =await notification.findOne({_id:id})
	if(data===null){
		return res.render("notfound")
	}
	let d = new Date(data.createAt);
	data.createAt = d.toJSON().slice(0,10).split('-').reverse().join('-')
	res.render("notificationDetail",{data:data, user:req.user, departmentName:phong})
	
});

router.get("*",function (req, res, next) {
	return res.render("notfound")
});
module.exports = router;
