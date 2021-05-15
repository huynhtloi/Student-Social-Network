const { check } = require('express-validator');
module.exports = [
    check('name').exists().withMessage('Vui lòng cung cấp tên người dùng')
    .notEmpty().withMessage('Vui lòng cung cấp tên người dùng'),

    check('gender').exists().withMessage('Vui lòng chọn giới tính')
    .notEmpty().withMessage('Vui lòng chọn giới tính'),

    check('birth').exists().withMessage('Vui lòng chọn ngày sinh')
    .notEmpty().withMessage('Vui lòng chọn ngày sinh'),

    check('faculty').exists().withMessage('Vui lòng cung cấp thông tin khoa')
    .notEmpty().withMessage('Vui lòng cung cấp thông tin khoa'),

    check('major').exists().withMessage('Vui lòng cung cấp ngành học')
    .notEmpty().withMessage('Vui lòng cung cấp ngành học'),
]