"use strict";

module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    res.render('index.ejs', {
      account: req.user
    });
  });

  app.get('/play', isLoggedIn, function(req, res) {
    var token = /connect\.sid=([^\;]*)/g.exec(req.headers.cookie)[1];

    res.render('play.ejs', {
      account: req.user,
      credentials: {
        ip: process.ip,
        token: token
      }
    });
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

  app.get('/login', isNotLoggedIn, function(req, res) {
    res.render('login.ejs', {
      account: req.user
    });
  });

  app.post('/login', passport.authenticate('login', {
    successRedirect : '/profile',
    failureRedirect : '/login'
  }));

  app.get('/signup', isNotLoggedIn, function(req, res) {
    res.render('signup.ejs', {
      account: req.user
    });
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

function isNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }

  res.redirect('/profile');
}
