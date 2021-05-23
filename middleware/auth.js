const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next){
  // get token from header
  // check if no token is prsent
  // verify token is valid
  const token = req.header('x-auth-token');

  if(!token){
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // jwt.verify(token, secretOrPublicKey, [options, callback])
  try{
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch(err){
    res.status(401).json({ msg: 'Token is not valid.' });
  }
}