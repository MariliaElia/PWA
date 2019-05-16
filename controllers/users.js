var User = require('../models/users');
var bcrypt = require('bcryptjs');
var LocalStrategy = require('passport-local').Strategy;


exports.login = function (passport) {
    passport.use(new LocalStrategy( {usernameField: username},
        function (username, password, done) {
            User.findOne({username: username},
                function (err, user) {
                    if (err)
                        ret.status(500).send('Invalid data!');

                    if (!user) {
                        return done(null, false, { message: 'That email is not registered' });
                    }

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
        }))
}

exports.serialize = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
}

exports.deserialize = function (passport) {
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}

//Get User Data when logging in
exports.signUser = function (req,res) {
    var userData = req.body;
    var username = req.body.username;
    var password = req.body.password;

    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    User.findOne({username: username},
        function (err, user) {
            if (err)
                ret.status(500).send('Invalid data!');
            if (user != null) {
                console.log("Username: " + user.username);

                if (user.username == username) {
                    //Compares encrypted password to plaintext password
                    bcrypt.compare(password, user.password, function(err, correct) {
                        if (err) {
                            console.log(err);
                        }
                        //Checks if password is correct
                        if (correct) {
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(userData));
                            console.log('password correct');
                        }
                        else {
                            res.setHeader('Content-Type', 'text/html');
                            res.send(JSON.stringify({data: "wrongData"}));
                        }
                    });
                } else {
                    //User wrote incorrect password
                    res.setHeader('Content-Type', 'text/html');
                    res.send(JSON.stringify({data: "wrongData"}));
                }
            } else {
                //User is not registered
                res.setHeader('Content-Type', 'text/html');
                res.send(JSON.stringify({data: "unregistered"}));
            }
        })
}

//Create a user, called when user signs up
exports.insert = function (req, res) {
    var userData = req.body;
    console.log('username: ' + userData.username);
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        //before adding the user in the db check if username is already taken
        User.findOne({username: userData.username},
            function(err, user) {
                if (err)
                    res.status(500).send('Invalid data!');

                //if username is taken tell the user
                if (user != null) {
                    var nil = new User({
                        username: 'exists',
                        name: '',
                        email: '',
                        password: ''
                    });
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(nil));
                } else {
                    //Add user data to the database
                    var user = new User({
                        username: userData.username,
                        name: userData.name,
                        email: userData.email,
                        password: userData.password
                    });
                    console.log('received: ' + user);

                    user.save(function (err, results) {
                        console.log(results._id);
                        if (err)
                            res.status(500).send('Invalid data!');

                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(user));
                    });
                }
        });
    } catch (e) {
        res.status(500).send('Error: ' + e);
    }
}