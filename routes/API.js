const express = require('express')
const { authenticateTokenAPIAdmin } = require('../config/token')
const router = express.Router()
const notificationAPI = require('../api/notificationAPI')
// GET
router.get('/' ,(req,res)=>{
    res.send('API of Student Portal')
})
router.use('/notification', notificationAPI)

module.exports = router