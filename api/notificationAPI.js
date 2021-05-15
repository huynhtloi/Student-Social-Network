const express = require('express')
const { authenticateTokenAPI } = require('../config/token')
const router = express.Router()
const postNofiticationValidator = require('../validator/postNoffication')
const {validationResult}= require('express-validator')
const socketIO = require("../config/socketIO")
const Notification = require('../models/notification')
const Permission = require('../models/permission')
// GET
const io = socketIO.io;


router.get('/', authenticateTokenAPI, async (req, res) => {

    let condition = {}
    let {maphong, page, start, end, unread } = req.query

    if (maphong) {
        condition.department= maphong
    }

    if (!start) {
        start = 0
    }

    if (!end) {
        end = Date.now()
    }

    await Notification.find({...condition, createAt: { $gte: start, $lte: end}}).sort( { createAt : -1} ).skip((page-1)*10).limit(10).exec(async (err, data) => {
        
        if (err){ 
            res.status(403).json({err: err})
        } 
        else { 
            await Notification.countDocuments({...condition, createAt: { $gte: start, $lte: end}}, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
   
                    res.status(200).json({ data: data , count : result})
                }
            });
            
        } 
    })
    
    
})
router.post('/',authenticateTokenAPI, postNofiticationValidator ,async (req,res)=>{
    let result = validationResult(req)
    if(result.errors.length ===0){
        let {title, content, department} = req.body
        let author = req.user.name
        const permissionToAdd = await Permission.findOne({maphong: req.user.type})
        if(!permissionToAdd || !permissionToAdd.department.includes(department)){
            return res.status(404).json({message:"Không đủ thẩm quyền"})
        }
        const newNofication = new Notification ({
            title: title,
            createAt: new Date().getTime(),
            content: content,
            department: department,
            author:author
        })

        newNofication.save(function(err,data){ 
            if (err){ 
                return res.json({message:err})
            } 
            else { 
                io.emit('add-notification',{title : title, id:data._id, department:department, createAt: newNofication.createAt, departmentName:author})
                return res.status(200).json({message:"Thêm thành công", data: data})
            } 
        }) 

    }else{
        let messages =result.mapped()
        let message = ""
        for(m in messages){
            message = messages[m]
            break
        }
        return res.json({message:message})
    }

})


module.exports = router