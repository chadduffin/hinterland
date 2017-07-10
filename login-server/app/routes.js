"use strict";

module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      account: req.user
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/login', function(req, res) {
    res.render('login.ejs');
  });

  app.post('/login', passport.authenticate('login', {
    successRedirect : '/profile',
    failureRedirect : '/login'
  }));

  app.get('/signup', function(req, res) {
    res.render('signup.ejs');
  });

  app.post('/signup', passport.authenticate('signup', {
    successRedirect : '/profile',
    failureRedirect : '/signup'
  }));

  app.use(function(req, res) {
    res.redirect('/');
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}
