var User = require('../models/users');
var bcrypt = require('bcryptjs');


//Get User Data when logging in
exports.signUser = function (req,res) {
    var userData = req.body;
    var username = req.body.username;
    var password = req.body.password;

    console.log('in here!' + username);

    if (userData.username == '' || userData.password == '') {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({data:"missing"}));
    }
    else {
        User.findOne({username: username},
            function (err, user) {
                if (err)
                    ret.status(500).send('Invalid data!');
                if (user != null) {
                    if (user.username == username) {
                        //Compares encrypted password to plaintext password
                        bcrypt.compare(password, user.password, function(err, correct) {
                            if (err) {
                                console.log(err);
                            }
                            // password correct
                            if (correct) {
                                res.setHeader('Content-Type', 'application/json');
                                res.send(JSON.stringify(userData));
                            }
                            // password incorrect
                            else {
                                res.setHeader('Content-Type', 'text/html');
                                res.send(JSON.stringify({data: "incorrect"}));
                            }
                        });
                    } else {
                        // incorrect username
                        res.setHeader('Content-Type', 'text/html');
                        res.send(JSON.stringify({data: "incorrect"}));
                    }
                } else {
                    //User is not registered
                    res.setHeader('Content-Type', 'text/html');
                    res.send(JSON.stringify({data: "incorrect"}));
                }
            })
    }
}

//Create a user, called when user signs up
exports.insert = function (req, res) {
    var userData = req.body;
    console.log('username: ' + userData.username);
    if (userData.username == '' || userData.name == '' || userData.email == '' || userData.password == '') {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({data:"missing"}));
    }
    else {
        try {
            //before adding the user in the db check if username is already taken
            User.findOne({username: userData.username},
                function(err, user) {
                    if (err)
                        res.status(500).send('Invalid data!');

                    //if username is taken tell the user
                    if (user != null) {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({data:"exists"}));
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
}