var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var User = require('../models/users');

module.exports = function (passport) {

    //Checks if username and password are correct
    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.findOne({username: username}, function (err, user) {
                if (err) {
                        return done(err);
                }
                if (user == null) {
                    console.log('here for name?');
                    return done(null, false);
                }

                //Checks if password is correct
                bcrypt.compare(password, user.password, function (err, correct) {
                    if (err) {
                        console.log(err);
                    }
                    if (correct) {
                        return done(null, user);
                    } else {
                        console.log('here for pass?')
                        return done(null, false);
                    }
                });
            })
        }));


    // correct credentials handled below

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}
