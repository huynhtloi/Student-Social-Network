const { check } = require('express-validator');
module.exports = [
    check('title').exists().withMessage('Thiếu tiêu đề bài viết')
    .notEmpty().withMessage('Tiêu đề bài viết không được để trống'),

    check('content').exists().withMessage('Thiếu nội dung bài viết')
    .notEmpty().withMessage('Nội dung bài viết không được để trống'),

    check('department').exists().withMessage('Thiếu mã phòng khoa')
    .notEmpty().withMessage('Mã phòng khoa không được để trống'),

]