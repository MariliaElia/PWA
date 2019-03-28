var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));
//var acc = require('./public');

router.get('/', function(req, res, next) {
    //if (acc.logged) {
        res.render('create-event', { title: 'photofest'});
    //}
    //else {
     //   res.render('login', { title: 'photofest'});
    //}

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