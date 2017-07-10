"use strict";

var BCrypt        = require("bcrypt-nodejs");
var Account       = require("../app/models/Account.js");
var LocalStrategy = require("passport-local").Strategy;

module.exports = function(passport) {
  passport.serializeUser(function(account, done) {
    done(null, account.get("email"));
  });

  passport.deserializeUser(function(email, done) {
    Account.get(email, function (err, account) {
      done(err, account);
    });
  });

  passport.use("login", new LocalStrategy({
    usernameField : "email",
    passwordField : "password",
    passReqToCallback : true
  },
  function(req, email, password, done) {
    if (email) {
      email = email.toLowerCase();
    }

    process.nextTick(function() {
      Account.get(email, function (err, account) {
        if (err) {
          return done(err);
        }
        if (!account) {
          return done(null, false);
        }
        if (!BCrypt.compareSync(password, account.get("password"))) {
          return done(null, false);
        }

        return done(null, account);
      });
    });
  }));

  passport.use("signup", new LocalStrategy({
    usernameField : "email",
    passwordField : "password",
    passReqToCallback : true
  },
  function(req, email, password, done) {
    if (email) {
      email = email.toLowerCase();
    }

    process.nextTick(function() {
      if (!req.account) {
        Account.get(email, function (err, account) {
          if (err) {
            return done(err);
          }

          if (account) {
            return done(null, false);
          } else {
            var account = new Account({
              email: email,
              password: BCrypt.hashSync(password, BCrypt.genSaltSync(64), null)
            });
            account.save(function (err) {
              if (err) {
                console.log("Error creating account for ", account.get("email"));
                return done(err); 
              }

              console.log("Created account for ", account.get("email"));
              return done(null, account);
            });
          }
        });
      } else {
        return done(null, account);
      }
    });
  }));
};
