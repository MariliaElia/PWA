var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('create-story', {title: 'photofest'});
});

router.post('/', function(req, res, next) {
    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(userData));
    //res.render('/index', { title: 'photofest'})
});

module.exports = router;