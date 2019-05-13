var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
//router.use(bodyParser.urlencoded({extended: false}));

var event = require('../controllers/events');
var user = require('../controllers/users');
var story = require('../controllers/stories');

/* GET home page. */
router.get('/', event.getEvents);

router.post('/', event.searchEvents);

/* MAP search */
router.get('/map', function(req, res, next){
    res.render('map', { title: 'photofest'} );
});
router.post('/map', event.getAllEvents);

//router.get('/', event.getAllEvents)
//Search post data
/*router.post('/', function(req, res, next) {
    var searchData = req.body;
    if (searchData == null) {
        res.status(403).send('No data sent!')
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(searchData));
});*/

/*router.get('/view-event/:id', function(req, res, next){
    var eventID = req.params.id;
    res.render('view-event', { title: 'photofest', eventID: eventID} );
});*/

router.get('/view-event/:id', event.getEventData)

//CREATE STORY get and post
router.get('/create-story/:id', function(req, res, next) {
    var eventID = req.params.id;
    res.render('create-story', { title: 'photofest', eventID: eventID});
});

/*router.post('/create-story', function(req, res, next) {
    var storyData = req.body;
    if (storyData == null) {
        res.status(403).send('No data sent!')
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(storyData));
});*/

router.post('/create-story',story.insertStory );

router.get('/account', function(req, res, next) {
    res.render('account', {title: 'photofest'});
});

router.post('/account', event.getUserEventsStories)

/* CREATE EVENT get and post */
router.get('/create-event', function(req, res, next) {
    res.render('create-event', {title: 'photofest'});
  });

router.post('/create-event', event.insertEvent)

/*router.post('/create-event', function(req, res, next) {
    var eventData = req.body;
    if (eventData == null) {
        res.status(403).send('No data sent!')
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(eventData));
});*/

/* LOGIN get and post */
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'photofest'});
});

router.post('/login', user.signUser);

/*
router.post( '/login', function (req,res,next) {
    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(userData));
});
*/

/* SIGN UP get and post */
router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'photofest'});
});

router.post('/signup', user.insert);

/* MESSAGE page for logging in when creating an event */
router.get('/message', function(req, res, next) {
    res.render('message', { title: 'photofest'});
});

module.exports = router;
