var User = require('../models/users');

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
                if (user.username == username && user.password == password) {
                    //User exists and password is correct
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(userData));
                }else{
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
                    console.log("Username is taken");
                } else {
                    //Add user data to he database
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
        res.status(500).send('error ' + e);
    }
}