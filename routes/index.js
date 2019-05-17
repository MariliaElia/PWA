var express = require('express');
var router = express.Router();
var passport = require('passport');
var event = require('../controllers/events');
var user = require('../controllers/users');
var story = require('../controllers/stories');
var auth = require('../config/auth');

/**
 * GET index
 * */
router.get('/', event.getEvents);

/**
 * POST event
 * date and name from form to search for events
 * */
router.post('/', event.searchEvents);

/**
 * GET map
 * search page
 * */
router.get('/map', function(req, res, next){
    res.render('map', { title: 'photofest'} );
});

/**
 * POST map
 * Get all events
 * from database
 * */
router.post('/map', event.getAllEvents);

/**
 * GET view-event
 * page
 * */
router.get('/view-event/:id', event.getEventData);

/**
 * GET create-story
 * page
 * */
router.get('/create-story/:id', auth.checkAuthenticated, event.getEventTitle)

/**
 * POST  create-story
 * form to insert in the database
 * */
router.post('/create-story', story.insertStory );

/**
 *  GET view-story
 */
router.get('/view-story/:id', story.getStoryData);

/**
 * POST view-story
 * comments from form and insert in the database
 */
router.post('/view-story', story.addComments);

/**
 * GET Account Page
 */
router.get('/account', auth.checkAccount, function(req, res, next) {
    console.log(req.user.username);
    res.render('account', { title: 'photofest', user: req.user });
});

/**
 * POST account
 * post username of user logged In and get user events and stories
 * */
router.post('/account', event.getUserEventsStories)

/**
 * GET create-event page
 * */
router.get('/create-event', auth.checkAuthenticated, function(req, res, next) {
    res.render('create-event', {title: 'photofest'});
  });

/**
 * POST create-event
 * post the form and insert into database*
 * */
router.post('/create-event', event.insertEvent)

/**
 * GET MESSAGE
 * page for logging in when creating an event or story if not logged In
 */
router.get('/message', function(req, res, next) {
    res.render('message', { title: 'photofest'});
});

/**
 * GET login page
 * */
router.get('/login', auth.forwardAuthenticated, function (req, res) {
    res.render('login', {title: 'photofest'});
});

/**
 * POST login
 * redirect to account page
 * */
router.post('/login',
        passport.authenticate('local', {
            successRedirect: '/account',
            failureRedirect: '/login-try-again'})
);

/** GET login-try-again
 * page for incorrect user credentials
 */
router.get('/login-try-again', function (req, res) {
    res.render('login-try-again', {title: 'photofest'});
});

/**
 * GET signup page
 * */
router.get('/signup', auth.forwardAuthenticated, function (req, res) {
    res.render('signup', {title: 'photofest'});
});

/**
 * POST signup
 * user data from sign up form and insert into database
 * */
router.post('/signup', user.insert, function (req,res) {

});

/**
 * GET logout page,
 * redirects to log in page
 * */
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

/**
 * GET offline
 * page gets displayed when user is offline
 */
router.get('/offline', function(req,res){
    res.render('offline',{title: 'photofest'});
});


module.exports = router;
