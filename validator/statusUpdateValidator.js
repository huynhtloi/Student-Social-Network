const { check } = require('express-validator');
module.exports = [
    check('statusTitle').exists().withMessage('Nội dung bài viết không được để trống')
    .notEmpty().withMessage('Nội dung bài viết không được để trống')
]