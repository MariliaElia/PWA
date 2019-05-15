var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var User = require('../models/users');


module.exports = function (passport) {
    //Checks if username and password are correct
    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.findOne({username: username},
                function (err, user) {
                    console.log(user);
                    if (err)
                        ret.status(500).send('Invalid data!');

                    if (!user) {
                        return done(null, false, { message: 'That email is not registered' });
                    }

                    //Checks if password is correct
                    bcrypt.compare(password, user.password, function (err, correct) {
                        if (err) {
                            console.log(err);
                        }
                        if (correct) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Password incorrect' });
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
