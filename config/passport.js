var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var User = require('../models/users');

//Passport user functions
module.exports = function (passport) {
    passport.use(new LocalStrategy(
        //Checks if username and password are correct
        function (username, password, done) {
            User.findOne({username: username}, function (err, user) {
                if (err) {
                        return done(err);
                }
                if (user == null) {
                    //Returns false if user is null
                    return done(null, false);
                }

                //Checks if password is correct
                bcrypt.compare(password, user.password, function (err, correct) {
                    if (err) {
                        console.log(err);
                    }
                    if (correct) {
                        //Returns user if password is correct
                        return done(null, user);
                    } else {
                        //Returns false if password is incorrect
                        return done(null, false);
                    }
                });
            })
        }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}
