var User = require('../models/users');

exports.getUserData = function (req, res) {
    try {
        User.findOne({username: req.params.username},
            function (err, user) {
                if (err)
                    res.status(500).send('Invalid data!');
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(user));
            });
    }
    catch (e) {
        res.status(500).send('error ' + e);
    }
}

exports.insert = function (req, res) {
    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    try {
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
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}