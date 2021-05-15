const express = require('express')
const router = express.Router()

const youtubeEmbed = require('youtube-embed')

const {authenticateToken,authenticateTokenAPI} = require('../config/token')
const mongoose = require('mongoose')

const statusModel = require('../models/status')
const commentModel = require('../models/comment')

const statusUpdateValidator = require('../validator/statusUpdateValidator')

const {validationResult} = require('express-validator')

const fetch = require("node-fetch");

const cloudinary = require('cloudinary').v2

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET
});


// api status: GET POST PUT DELETE
// TẤT CẢ ĐỀU SÀI _id của mongodb tự động tạo để sử dụng CRUD
// GET

// GET ALL STATUS
router.get('/', authenticateToken,async function(req, res, next) {
    await statusModel.find()
    .sort({dateModified: 'desc'})
    .select('_id author statusTitle statusId dateModified like image')
    .then((allStatus) => {
      return res.status(200).json({
        success: true,
        message: 'A list of all status',
        Status: allStatus,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: err.message,
      });
    });
})

// GET LIMIT STATUS
router.get('/page/:skip', authenticateToken,async function(req, res, next) {
    const skip = parseInt(req.params.skip)
    // console.log("skip:",skip)
    const limit = 3

    // console.log("status API --- skip & limit")
    // console.log("đây là limit:",limit)
    // console.log("đây là skip:",skip)

    await statusModel.find().limit(limit).skip(skip)
    .sort({dateModified: 'desc'})
    .populate('user')
    .select('_id author statusTitle statusId dateModified like image user video')
    .then((allStatus) => {
      return res.status(200).json({
        success: true,
        message: 'A list of all status',
        Status: allStatus,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: err.message,
      });
    });
})

// GET STATUS BY ID
router.get('/:id' , authenticateToken, async function(req, res, next) {
    const id = req.params.id
    await statusModel.findById(id)
    .then((singleStatus) => {
        return res.status(200).json({
        success: true,
        message: `More on ${singleStatus.statusId}`,
        Status: singleStatus,
        });
    })
    .catch((err) => {
        return res.status(500).json({
        success: false,
        message: 'This status does not exist in database',
        error: err.message,
        });
    });
})

// POST

// POST STATUS
router.post('/', authenticateToken,async function(req, res, next) {
    if (!req.body) {
        return res.status(500).json({
                success: false,
                message: 'data error. Please try again.',
                error: error.message,
        });
    }
    let cookie = req.cookies
    const data = req.body

    let status = new statusModel({
        statusId: mongoose.Types.ObjectId(),
        like: undefined,
        statusTitle: data.statusTitle,
        dateModified: new Date(),
        user: req.user._id
    })

    if (data.image) {
        let queryImg = {
            image: data.image,
            image_name: status._id,
            folder: `status/${status._id}`
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
        status.image = url
    }

    if (data.video) {
        status.video = youtubeEmbed(data.video)
    }

    try {
        const temp = await status.save()
        const newStatus = await statusModel.findById(temp._id).populate('user')
        if (newStatus == null || newStatus == undefined) {
            throw new Error('Server error. Please try again.')
        }
        return res.status(200).json({
            success: true,
            message: 'New status created successfully',
            Status: newStatus,
        });
    } catch (error) {
        throw new Error('Server error. Please try again.')
    }
})
// PUT STATUS LIKE BY ID
router.put('/like/:id' ,authenticateToken,async function(req, res, next) {
    if (!req.body) {
        return res.status(500).json({
                success: false,
                message: 'data error. Please try again.',
                error: error.message,
        });
    }
    const log =  await statusModel.findOneAndUpdate(
        {_id: req.params.id},
        {
            author: req.body.author,
            statusTitle: req.body.statusTitle,
            image: req.body.image,
            like: req.body.like,
            dateModified: req.body.dateModified
        },
        {
            useFindAndModify: false,
            upsert: false,
            new: true
        }
    )
    .exec()
    .then((oldStatus) => {
        return res.status(200).json({
            success: true,
            message: 'this status was updated successfully',
            Status: oldStatus,
        });
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: err.message,
        });
    });
})

// PUT STATUS form BY ID

router.put('/:id', authenticateToken, statusUpdateValidator, async function(req, res, next) {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        let cookie = req.cookies
        const {image, video, statusTitle} = req.body
        const {id} = req.params
        let statusTemp = {
            statusTitle,
            image: undefined,
            video: undefined
        }

        if (image) {
            let queryImg = {
                image: image,
                image_name: id,
                folder: `status/${id}`
            }

            let url = await fetch(`${process.env.URL}/api/upload-image-v2`, {
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
                return null
            }).catch(error => {
                return res.status(500).json({
                    status: false,
                    error: error.message
                })
            })
            statusTemp.image = url
        }
    
        if (video) {
            statusTemp.video = youtubeEmbed(video)
        }

        try {
            var newStatus = await statusModel.findByIdAndUpdate(id, statusTemp, {new: true, useFindAndModify: false})

            if (newStatus == null || newStatus == undefined) {
                throw new Error('Lỗi xảy ra, vui lòng refresh lại trang')
            }
            return res.status(200).json({
                status: true,
                message: 'Cập nhật bài viết thành công',
                Status: newStatus
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

// DELETE STATUS BY ID

router.delete('/:id' ,authenticateToken,async function(req, res, next) {
    const id = req.params.id
    await statusModel.findByIdAndRemove(id, {useFindAndModify: false})
    .exec()
    .then(()=> {
        try {
            cloudinary.uploader.destroy(`status/${id}/${id}`)
            cloudinary.api.delete_folder(`status/${id}`)
            commentModel.findOneAndRemove({statusId: id}, {useFindAndModify: false})
            return res.status(200).json({
                status: true,
                message: 'Xoá bài viết thành công',
            })
        } catch (error) {
            throw Error(error.message)
        }
    })
    .catch((err) => {
        return res.status(500).json({
            status: false,
            error: err.message,
        })
    });
})
module.exports = router