var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
//router.use(bodyParser.urlencoded({extended: false}));

var event = require('../controllers/events');
var user = require('../controllers/users');
var story = require('../controllers/stories');

/*GET index page*/
router.get('/', event.getEvents);

/*POST event date and name from form to search for events*/
router.post('/', event.searchEvents);

/*GET map search page*/
router.get('/map', function(req, res, next){
    res.render('map', { title: 'photofest'} );
});

/*Get all events from database*/
router.post('/map', event.getAllEvents);

/*GET view-event page*/
router.get('/view-event/:id', event.getEventData)

/*GET create-story page*/
router.get('/create-story/:id', event.getEventTitle)

/*POST data from create-story form to insert in the database*/
router.post('/create-story',story.insertStory );

/*GET Account Page*/
router.get('/account', function(req, res, next) {
    res.render('account', {title: 'photofest'});
});

/*POST username of user logged In and get user events and stories*/
router.post('/account', event.getUserEventsStories)

/*GET create-event page*/
router.get('/create-event', function(req, res, next) {
    res.render('create-event', {title: 'photofest'});
  });

/*POST data from create-event form and insert into dtabase*/
router.post('/create-event', event.insertEvent)

/*GET login page*/
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'photofest'});
});

/*POST user data from login form to log them in*/
router.post('/login', user.signUser);

/*GET signup page*/
router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'photofest'});
});

/*POST user data from sign up form and insert into database*/
router.post('/signup', user.insert);

/* MESSAGE page for logging in when creating an event or story if not logged In*/
router.get('/message', function(req, res, next) {
    res.render('message', { title: 'photofest'});
});

module.exports = router;
