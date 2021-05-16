// MIDDLEWARE
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const flash = require('connect-flash');

// API
const statusAPI = require("./api/statusAPI");
const commentAPI = require("./api/commentAPI");
const uploadImageAPI = require('./api/upLoadImageAPI')
const userAPI = require('./api/userAPI')
const uploadImageV2Api = require('./api/uploadImageV2Api')

// ROUTES
const api = require("./routes/API");
const departmentRouter = require("./routes/department");
const loginRouter = require("./routes/login");
const indexRouter = require("./routes/index");
const notificationRouter = require('./routes/notification');
const profileRouter = require('./routes/profile');

require('dotenv').config()
const {ensureAuth, ensureGuest} = require('./middleware/auth')
const app = express();
const fs = require('fs')

// DATABASE
const mongoose = require('mongoose')

// SESSION
const session = require('express-session')
var options = {
    etag: true,
    //maxAge: 3600000, //in ms i.e 1 hr in this case
    redirect: true,
    setHeaders: function (res, path, stat) {
      //any other header in response
      res.set({
          'x-timestamp': Date.now(),
          'joseph' : 'hi',
          'Cache-Control' : (path.includes('index.html')) ? 'no-store' : 'public, max-age=3600000'
        });
    }
}

app.use(
	session({
	  secret: 'keyboard cat',
	  resave: false,
		saveUninitialized: false,
	  cookie:{maxAge: 3600000}
	})
)


// PASSPORT
const passport = require('passport');
const notification = require("./models/notification");

// PASSPORT CONFIG
require('./config/passport')(passport)

// PASSPORT MIDDLEWARE
app.use(passport.initialize())
app.use(passport.session())

// VIEW ENGINE SETUP
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(logger("dev"));
app.use(express.json({limit: '50mb'}));
app.use(
	express.urlencoded({

		extended: false,
	})
);

app.use(flash());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), options));


app.use("/auth", loginRouter);

// API---

//UPLOAD IMAGE
app.use('/upload-image', uploadImageAPI)
app.use('/api/upload-image-v2', uploadImageV2Api)

//API NOTIFICATION
app.use('/api', api)
app.use("/status",statusAPI)
app.use("/comment",commentAPI)
app.use("/user",userAPI)




app.use(ensureAuth)
app.use("/",indexRouter);
app.use("/department", departmentRouter);
app.use("/notification",notificationRouter);
app.use("/profile", profileRouter);



// CATCH ERROR AND FORWARD TO HANDLE
app.use(function (req, res, next) {
	return res.render("notfound")
});

// ERROR HANDLE
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	return res.render("error");
});


//CONNECT DATABASE: MONGO ATLAS
mongoose.connect(process.env.DB_CONNECTION,
	{
		useNewUrlParser:true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log("Connected to the database!");
	})
	.catch(err => {
		console.log("Cannot connect to the database!", err);
		process.exit();
	});
module.exports = app;
