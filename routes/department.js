var express = require('express');
const createError = require("http-errors");
var router = express.Router();
var path = require('path');
const fs = require('fs'); 
const User = require('../models/user')
const addDepartmentValidator = require('../validator/addDepartmentValidator');
const { validationResult } = require('express-validator');
const {hash, verify} = require('../config/crypto')
var mongoose = require('mongoose');
const { type } = require('os');
const permission = require('../models/permission');
/* GET login page. */
router.get('/', async function (req, res, next) {
	let user = await User.find()
	let department = user.filter(user =>  user.type !== "admin" && user.type !== 'student' )
	res.render('dashboardDepartment',{user: req.user, department:department});
});

//post
router.get('/add', async function (req, res, next) {
	let user = await User.find()
	let department = user.filter(user =>  user.type !== "admin" && user.type !== 'student' )
	if(req.user.type !=="admin") return res.send('Access dineid')
	res.render('addDepartment',{user: req.user, department:department});
});

router.post('/add', addDepartmentValidator, async function (req, res, next) {
	let result = validationResult(req)
    if(result.errors.length ===0){
		let { username, pass, name, maphong, urlImage, department } = req.body
		let passwordHash = await hash(pass)
		let arrayDepartment = []
		arrayDepartment = arrayDepartment.concat(department)
        const newUser = {
			userId: mongoose.Types.ObjectId(),
			name: name,
			image: urlImage,
			type: maphong,
			username:username,
			password:passwordHash
		}
		const permissionDepartment = {
			maphong: maphong,
			department:[...arrayDepartment, maphong]
		}
		try {
			let user = await User.findOne({$or:[{username: username},{type:maphong}]})
			if (user) {
                return res.json({success:false,mess:"Đã tồn tại mã phòng hoặc username"})
			}
			await permission.create(permissionDepartment)
			await User.create(newUser)
			return res.status(200).json({success:true,mess:"Thêm phòng ban thành công"})
		} catch (error) {
			return res.json({success:false,mess:"da xay ra loi"})
		}
		
	} else {
        let messages =result.mapped()
        let message = ""
        for(m in messages){
            message = messages[m]
            break
        }
        return res.json({success:false,mess:message.msg})
    }
});


// CATCH ERROR AND FORWARD TO HANDLE
router.get("*",function (req, res, next) {
	res.render("notfound")
});


module.exports = router