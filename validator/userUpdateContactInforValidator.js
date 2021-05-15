const { check } = require('express-validator');
module.exports = [
    check('phone').exists().withMessage('Vui lòng cung cấp số điện thoại')
    .notEmpty().withMessage('Vui lòng cung cấp số điện thoại')
    .custom((value) => {
        if (value.length != 10) {
            throw new Error("Số điện thoại không được nhỏ hay lớn hơn 10 số")
        }
        return true;
    }),

    check('address').exists().withMessage('Vui lòng cung cấp địa chỉ của bạn')
    .notEmpty().withMessage('Vui lòng cung cấp địa chỉ của bạn'),
]