var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'photofest'});
});

router.post('/', function(req, res, next) {
    var searchData = req.body;
    var title = req.body.eventName;
    var date = req.body.date;
    if (searchData == null) {
        res.status(403).send('No data sent!')
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(searchData));
});

router.get('/view-event/:id', function(req, res, next){
    var eventID = req.params.id;
    res.render('view-event', { title: 'photofest', eventID: eventID} );
});

router.get('/create-story/:id', function(req, res, next) {
    var eventID = req.params.id;
    res.render('create-story', { title: 'photofest', eventID: eventID});
});

/*router.post('/', function(req, res, next) {
  res.render('create-story', { title: 'photofest'})
});*/

router.post('/create-story', function(req, res, next) {
    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(userData));
    //res.render('/index', { title: 'photofest'})
});

router.get('/account', function(req, res, next) {
    res.render('account', {title: 'photofest'});
});

router.get('/create-event', function(req, res, next) {
    res.render('create-event', {title: 'photofest'});
});

router.post('/create-event', function(req, res, next) {
    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(userData));
});

router.get('/map', function(req, res, next) {
    res.render('map', { title: 'photofest'});
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'photofest'});
});

router.post('/login', function(req, res, next) {
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


router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'photofest'});
});

router.post('/signup', function(req, res, next) {
    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(userData));
});


router.get('/message', function(req, res, next) {
    res.render('message', { title: 'photofest'});
});

router.get('/test', function (req,res,next) {
    res.render('test');
});

module.exports = router;
