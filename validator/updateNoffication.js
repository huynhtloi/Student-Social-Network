const { check } = require('express-validator');
module.exports = [
    check('id').exists().withMessage('Thiếu mã thông báo')
    .notEmpty().withMessage('Mã thông báo không được để trống'),

    check('title').exists().withMessage('Thiếu tiêu đề bài viết')
    .notEmpty().withMessage('Tiêu đề thông báo không được để trống'),

    check('content').exists().withMessage('Thiếu nội dung bài viết')
    .notEmpty().withMessage('Nội dung thông báo không được để trống'),

    check('department').exists().withMessage('Thiếu mã phòng khoa')
    .notEmpty().withMessage('Mã phòng khoa không được để trống'),

]