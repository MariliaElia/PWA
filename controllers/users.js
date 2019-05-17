var User = require('../models/users');

/**
 * insert
 * Create a user, called when user signs up
 * @param req
 * @param res
 */
exports.insert = function (req, res) {
    var userData = req.body;
    console.log('username: ' + userData.username);
    if (userData.username == '' || userData.name == '' || userData.email == '' || userData.password == '') {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({data:"missing"}));
    }
    else {
        try {
            //Before adding the user in the db check if username is already taken
            User.findOne({username: userData.username},
                function(err, user) {
                    if (err)
                        res.status(500).send('Invalid data!');

                    //If username is taken tell the user
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