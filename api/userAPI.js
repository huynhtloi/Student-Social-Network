const express = require('express')
const passport = require('passport')
const router = express.Router()
const {authenticateToken,authenticateTokenAPI} = require('../config/token')
const mongoose = require('mongoose')
const userModel = require('../models/user')
const socketIO = require("../config/socketIO")

const io = socketIO.io;

const {validationResult} = require('express-validator')

const userUpdateBasicValidator = require('../validator/userUpdateBasicInforValidator')
const userUpdateContactValidator = require('../validator/userUpdateContactInforValidator')

const fetch = require("node-fetch");

// api user: GET
// TẤT CẢ ĐỀU SÀI _id của mongodb tự động tạo để sử dụng CRUD
// GET

router.get('/:id' ,authenticateToken,async function(req, res, next) {
    const id = req.params.id
    await userModel.findById(id)
    .then((singleUser) => {
        res.status(200).json({
        success: true,
        message: `More on ${singleUser._id}`,
        user: singleUser,
        });
    })
    .catch((err) => {
        res.status(500).json({
        success: false,
        message: 'This user does not exist in database',
        error: err.message,
        });
    });
})


router.put('/basic/:id', authenticateToken, userUpdateBasicValidator, async (req, res, next) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        const {id} = req.params
        const {name, gender, birth, faculty, major} = req.body
        const query = {
            name, gender, birth: new Date(birth), faculty, major
        }

        try {
            const newUser = await userModel.findByIdAndUpdate(id, query, {new: true, useFindAndModify: false})
            if (newUser == null || newUser == undefined) {
                throw new Error('Lỗi xảy ra, vui lòng refresh lại trang')
            }
            return res.status(200).json({
                status: true,
                message: 'Cập nhật thành công',
                User: newUser
            })
        } catch (error) {
            return res.status(500).json({
                status: false,
                error: error.message
            })
        }
    }
    else {
        let messages = result.mapped()
        let message = 'error - 404 not found'
        for (m in messages) {
            message = messages[m].msg
            break
        }
		return res.status(500).json({
			status: false,
			error: message
		})
    }
})

router.put('/contact/:id', authenticateToken, userUpdateContactValidator, async (req, res, next) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        const {id} = req.params
        const {phone, address} = req.body
        const query = {
            phone, address
        }

        try {
            const newUser = await userModel.findByIdAndUpdate(id, query, {new: true, useFindAndModify: false})
            if (newUser == null || newUser == undefined) {
                throw new Error('Lỗi xảy ra, vui lòng refresh lại trang')
            }
            return res.status(200).json({
                status: true,
                message: 'Cập nhật thành công',
                User: newUser
            })
        } catch (error) {
            return res.status(500).json({
                status: false,
                error: error.message
            })
        }
    }
    else {
        let messages = result.mapped()
        let message = 'error - 404 not found'
        for (m in messages) {
            message = messages[m].msg
            break
        }
		return res.status(500).json({
			status: false,
			error: message
		})
    }
})


router.put('/image/:id',authenticateToken, async (req, res, next) => {
    const {image} = req.body
    const {id} = req.params
    let cookie = req.cookies

    try {
        if (!image) {
            throw new Error('Vui lòng chọn ảnh đại diện')
        }

        let queryImg = {
            image: image,
            image_name: id,
            folder: `users/${id}`
        }
    
        const url = await fetch(`${process.env.URL}/api/upload-image-v2`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `connect.sid=${cookie['connect.sid']};token=${cookie.token}`
            },
            body: JSON.stringify(queryImg)
        }).then(res => res.text())
        .then(data => {
            data = JSON.parse(data)
            if (data.status) {
                return data.result.url
            }
        }).catch(error => {
            return res.status(500).json({
                status: false,
                error: error.message
            })
        })
        
        const newUser = await userModel.findByIdAndUpdate(id, {image: url}, {new: true, useFindAndModify: false})

        if (newUser == null || newUser == undefined) {
            throw new Error('Lỗi xảy ra, vui lòng refresh lại trang')
        }

        return res.status(200).json({
            status: true,
            message: 'Cập nhật ảnh đại diện thành công',
            User: newUser
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message
        })
    }
})
module.exports = router