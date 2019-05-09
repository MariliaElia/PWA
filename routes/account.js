var express = require('express');
var router = express.Router();

var user = require('../controllers/users');

router.get('/', function(req, res, next) {
    res.render('account', {title: 'photofest'});
});

router.get('/:username', user.getUserData);

router.post('/', function(req, res, next) {
    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(userData));
});

module.exports = router;