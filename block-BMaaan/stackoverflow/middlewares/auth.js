var User = require('../models/user');

module.exports = {
  isUserLoggedIn: (req, res, next) => {
    if (req.session && req.session.userId) {
      return next();
    } else {
      req.flash('warn', 'Unauthorized Access');
      req.session.returnsTo = req.originalUrl;
      return res.redirect('/users/login');
    }
  },
    userInfo: (req, res, next) => {
        let userId = req.session && req.session.userId;
        if (userId) {
          User.findById(userId, 'username email').then((user) => {
            req.user = user;
            res.locals.user = user;
            next();
          });
        } else {
          req.user = null;
          res.locals.user = null;
          next();
        }
      }
}