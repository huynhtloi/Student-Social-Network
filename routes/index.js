var express = require('express');
const passport = require('passport');
var router = express.Router();
const {authenticateToken} = require('../config/token')

const fetch = require("node-fetch");
const {getCurrentTime} = require('../config/currentTime')

/* GET users listing. */
router.get('/' , authenticateToken,async function(req, res) {
    cookie = req.cookies
    // khai báo khi vào index mặc định load 3 status
    await fetch(process.env.URL + `/status/page/0`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `connect.sid=${cookie['connect.sid']};token=${cookie.token}`
        }
    })
    .then(res => res.text())
    .then(async json => {
        if (JSON.parse(json).success) {
            let checkLike = false
            let arraySortStatus = JSON.parse(json).Status.map(async status => {
    
                startTime = new Date(status.dateModified)
                endTime = new Date()
                const currentTime = getCurrentTime(startTime, endTime)
                status["currentTime"] = currentTime
    
                // parse array like - json
                // parse thành json
                // lúc khởi tạo status.like chưa có trong model vì vậy ta phải kiểm tra tính xác thức của nó
                if (!status.like) {
                    status.like = []
                    status.checkLike = false
                }
                else {
                    status.like = JSON.parse(status.like)
                    status.like.forEach(l => {
                        if (req.user._id == l._id) {
                            checkLike = true
                        }
                    });
                    status.checkLike = checkLike
                    // gắn lại giá trị default cho biến checkLike để sử dụng cho element vòng lặp kế tiếp
                    checkLike = false
                }
    
                // fetch get comment API: lấy các comment trong 1 status
                let comments = await fetch(`${process.env.URL}/comment/status/${status._id}/0`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': `connect.sid=${cookie['connect.sid']};token=${cookie.token}`
                    }
                })
                .then(res => res.text())
                .then(async data => {
                    if (JSON.parse(data).success) {
                        let comments = JSON.parse(data).Comment.map(async comment => {
                            const timeComment = getCurrentTime(new Date(comment.dateModified), new Date())
                            comment['dateModified'] = timeComment

                            const commentNew = await fetch(`${process.env.URL}/user/${comment.author}`,{
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Cookie': `connect.sid=${cookie['connect.sid']};token=${cookie.token}`
                                }
                            })
                            .then(res => res.text())
                            .then(dataAuthorComment => {
                                authorComment = JSON.parse(dataAuthorComment)
                                if (authorComment.success) {
                                    comment['imgAuthor'] = authorComment.user.image
                                    comment['nameAuthor'] = authorComment.user.name
                                    comment['id'] = authorComment.user._id
                                    // console.log(comment)
                                    return comment
                                }
                                else {
                                    return undefined
                                }
                            }).catch(e => {
                                console.log(e)
                                return res.render('index',{user: req.user, allStatus: []});
                            })

                            // console.log(JSON.parse(commentNew))
                            return commentNew
                        })
                        
                        return await Promise.all(comments)
                    }
                    return undefined
                }).catch(e => {
                    console.log(e)
                    return res.render('index',{user: req.user, allStatus: []});
                })
                status['comments'] = comments
                // console.log(status)
                return status
                // console.log(comments)
            });
            resultStatus = await Promise.all(arraySortStatus)
            // log 1 comment của 1 status
            // console.log(resultStatus[0])
            // console.log(resultStatus[0].comments)
            // console.log(resultStatus[0].comments.length)
            // console.log("đổ data thành công")
            return res.render('index',{user: req.user, allStatus: resultStatus, lengthStatus: 0});
        }
        return res.render('index',{user: req.user, allStatus: [], lengthStatus: 0});
    })
    .catch(e => {
        console.log(e)
        return res.render('index',{user: req.user, allStatus: [], lengthStatus: 0});
    })
});

router.post('/', authenticateToken, async function(req, res, next) {
    const statusTitle = req.body.statusTitle
    let image = req.body.imageStatus
    let video = req.body.urlYoutube

    let status = {
        statusTitle: statusTitle,
        image: image,
        video
    }
    fetch(process.env.URL + '/status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `connect.sid=${cookie['connect.sid']};token=${cookie.token}`
            },
            body: JSON.stringify(status)
        })
        .then(res => res.json())
        .then(json => {
            // console bên node server
            startTime = new Date(json.Status.dateModified)
            endTime = new Date()
            const currentTime = getCurrentTime(startTime, endTime)
            json.Status["currentTime"] = currentTime
            return res.json(json)
        })
        .catch(e => {
            console.log(e)
        })
});


// router.get("*",function (req, res, next) {
// 	res.render("notfound")
// });
module.exports = router;
