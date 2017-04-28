const HTTPStatus = require('http-status');

function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'Admin') {
    next();
    return;
  }
  res.status(HTTPStatus.FORBIDDEN).json();
}

function isUser(req, res, next) {
  if (req.user.role === 'User') {
    next();
    return;
  }
  res.status(HTTPStatus.FORBIDDEN).json();
}

module.exports = { isAdmin, isUser };

