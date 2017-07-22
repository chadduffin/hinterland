"use strict";

process.title = "login-server";

var App          = require("express")();
var Port         = process.env.PORT || 8080;
var Address      = require('ip');
var Passport     = require("passport");
var CurrentDate  = new Date;

var CookieParser = require("cookie-parser");
var BodyParser   = require("body-parser");
var Session      = require("express-session");
var BCrypt       = require("bcrypt-nodejs");

process.ip = Address.address();

require("./config/Passport")(Passport);

App.use(CookieParser());
App.use(BodyParser.json());
App.use(BodyParser.urlencoded({
  extended: true
}));

App.set("view engine", "ejs");

App.use(Session({
    secret: CurrentDate.toISOString(),
    saveUninitialized: true,
    resave: true
}));

App.use(Passport.initialize());
App.use(Passport.session());

require("./app/routes.js")(App, Passport);

App.listen(Port);
