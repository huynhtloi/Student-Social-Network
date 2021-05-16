module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            return res.redirect('/auth')
        }
    },
    ensureGuest: function (req, res, next) {
        if (!req.isAuthenticated()) {
            req.flash("loginMessage", req.flash('loginMessage')[0])
            return next();
        } else {
            return  res.redirect('/');
        }
    },
}