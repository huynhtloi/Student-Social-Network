const jwt = require('jsonwebtoken')
function authenticateTokenAPI(req, res, next) {
    // Gather the jwt access token from the request header
  const authHeader = req.cookies.token
    const token = authHeader
    if (token == null) return res.status(401).json({message:"Missing token"}); // if there isn't any token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET , (err, user) => {
      if (err) return res.status(203).json({message:"Non-Authoritative Information"});
      next() // pass the execution off to whatever request the client intended
    })
}

//Xac thu api cho admin va phong ban
function authenticateTokenAPIAdmin(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.cookies.token
    const token = authHeader
    if (token == null) return res.status(401).json({message:"Missing token"}); // if there isn't any token
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET , (err, user) => {
      if (err) return res.status(203).json({message:"Non-Authoritative Information"});
      if(user.type !=="student" ) return res.status(203).json({message:"Access denied"});
      next() // pass the execution off to whatever request the client intended
    })
}

function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.cookies.token
    const token = authHeader
    if (token == null) return res.sendStatus(401) // if there isn't any token
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET , (err, user) => {
      if (err) return res.redirect('/auth/logout')
      next() // pass the execution off to whatever request the client intended
    })
}
function generateAccessToken(username) {
    // expires after half and hour (1800 seconds = 30 minutes)
    try {
        return jwt.sign(username, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3000s' });
    } catch (error) {
        console.log(error)
    }
     
}
function parseCookies (request) {
  var list = {},
      rc = request.headers.cookie;

  rc && rc.split(';').forEach(function( cookie ) {
      var parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  return list;
}
module.exports = {authenticateToken, generateAccessToken,authenticateTokenAPI,authenticateTokenAPIAdmin, parseCookies}