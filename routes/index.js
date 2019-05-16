var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var passport = require('passport');
//router.use(bodyParser.urlencoded({extended: false}));

var event = require('../controllers/events');
var user = require('../controllers/users');
var story = require('../controllers/stories');

var auth = require('../config/auth');

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
router.get('/view-event/:id', event.getEventData);

/*GET create-story page*/
//router.get('/create-story/:id', event.getEventTitle);
router.get('/create-story/:id', auth.checkAuthenticated, event.getEventTitle)

/*POST data from create-story form to insert in the database*/
router.post('/create-story', story.insertStory );

/*GET view-story page*/
router.get('/view-story/:id', story.getStoryData);

/*POST comments from form and insert in the database*/
router.post('/view-story', story.addComments);

/*GET Account Page*/
router.get('/account', auth.checkAccount, function(req, res, next) {
    console.log(req.user.username);
    res.render('account', { title: 'photofest', user: req.user });
});

/*POST username of user logged In and get user events and stories*/
router.post('/account', event.getUserEventsStories)

/*GET create-event page*/
router.get('/create-event', auth.checkAuthenticated, function(req, res, next) {
    res.render('create-event', {title: 'photofest'});
  });

/*POST data from create-event form and insert into database*/
router.post('/create-event', event.insertEvent)

/* MESSAGE page for logging in when creating an event or story if not logged In*/
router.get('/message', function(req, res, next) {
    res.render('message', { title: 'photofest'});
});

/*GET login page*/
router.get('/login', auth.forwardAuthenticated, function (req, res) {
    res.render('login', {title: 'photofest'});
});

/*POST redirect to account page*/
router.post('/login',
        passport.authenticate('local', {
            successRedirect: '/account',
            failureRedirect: '/login',
            failureFlash: true
        })
);

/*GET signup page*/
router.get('/signup', auth.forwardAuthenticated, function (req, res) {
    res.render('signup', {title: 'photofest'});
});

/*POST user data from sign up form and insert into database*/
router.post('/signup', user.insert);

/*GET logout page, redirects to log in page*/
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

/*
router.get('/offline', function(req,res){
    res.render('offline',{title: 'photofest'});
});
*/

module.exports = router;
