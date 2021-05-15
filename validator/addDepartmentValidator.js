const { check } = require('express-validator');
module.exports = [
    check('username').exists().withMessage('Tên đăng nhập không được để trống')
    .notEmpty().withMessage('Tên đăng nhập không được để trống'),

    check('pass').exists().withMessage('Thiếu mật khẩu')
        .notEmpty().withMessage('Mật khẩu không được để trống')
    .isLength({min:6}).withMessage("Mật khẩu có ít nhất 6 kí tự"),

    check('name').exists().withMessage('Tên phòng không được để trống')
        .notEmpty().withMessage('Tên phòng không được để trống'),
    
    check('maphong').exists().withMessage('Mã phòng không được để trống')
        .notEmpty().withMessage('Mã phòng không được để trống'),
    
    check('re_pass').exists().withMessage('Xác nhận mật khẩu không được để trống')
        .notEmpty().withMessage('Xác nhận mật khẩu không được để trống')
        .custom(async (confirmPassword, {req}) => { 
            const password = req.body.pass 
            if(password !== confirmPassword){ 
                throw new Error('Xác nhận mật khẩu không chính xác') 
            } 
        }), 
    check('urlImage').exists().withMessage('Phải có ảnh đại diện')
        .notEmpty().withMessage('Phải có ảnh đại diện'),
    
]