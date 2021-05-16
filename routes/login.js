var express = require('express');
var router = express.Router();
const passport = require('passport');
//token
const jwt = require('jsonwebtoken')
const {generateAccessToken} = require('../config/token')
const {
	ensureGuest
} = require('../middleware/auth')
const createError = require("http-errors");
const User = require('../models/user')


/* GET login page. */
router.get('/', ensureGuest, async function (req, res, next) {
	res.setHeader('Cache-Control', "max-age=86400")
	res.render('login', {
		error: req.flash('loginMessage')
	});
});

router.post('/',(req, res, next) => {
	passport.authenticate('local-login',{
			successRedirect: '/',
			failureRedirect: '/auth',
			failureFlash: true,	
		}, function (err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			// req.flash('loginMessage', 'Email or password is incorrect')
			return res.json({error:info.message});
		}
		req.logIn(user, function (err) {
			if (err) {
				return next(err);
			}
			// Tạo 1 token và payload data và response lại với status code là 200 cùng với payloaded data
			const token = generateAccessToken({ userId: user.id, type:user.type})
			res.cookie('token', token)
			return res.json({token:token});
			// res.redirect('/')
		});
	})(req, res, next);
});



//logout
router.get('/logout', function (req, res, next) {
	req.logOut()
	res.redirect('/')
});
//signin with google
router.get('/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}));
router.get(
	'/google/callback',
	// passport.authenticate('google', {successRedirect:'/', failureRedirect: '/1231232',failureMessage:"email is not valid"}),
	(req, res, next) => {
		passport.authenticate('google', function (err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {
				req.flash('loginMessage', `Email must be TDTU's mail`)
				return res.redirect('/auth');
			}
			req.logIn(user, function (err) {

				if (err) {
					return next(err);
				}
				const token = generateAccessToken({ userId: user.id, type:user.type})
				res.cookie('token', token)
				return res.redirect('/');
			});
		})(req, res, next);
	}
)

// catch 404 and forward to error handler
router.use(function (req, res, next) {
	res.render("notfound")
});

// error handler
router.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});


module.exports = router;