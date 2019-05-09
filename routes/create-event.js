var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));

var event = require('../controllers/events');

router.get('/', function(req, res, next) {
    //var log = req.cookies['loggedIn'];
    //if (log) {
        res.render('create-event', {title: 'photofest'});
    //}
    //else {
    //    res.render('login', {title: 'photofest'});
    //}

});
/*
router.post('/', function(req, res, next) {
    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(userData));
    //res.render('/index', { title: 'photofest'})
});
*/

router.post('/', event.insertEvent)

module.exports = router;