var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));

router.get('/', function(req, res, next) {
    res.render('login', { title: 'photofest'});
});

router.post('/', function(req, res, next) {
    var userData = req.body;
    var username = req.body.username;
    var password = req.body.password;
    console.log(username);
    console.log(password);
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    //res.cookie('loggedIn', true);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(userData));
});

module.exports = router;