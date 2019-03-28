var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'photofest'});
});

router.get('/view-event/:id', function(req, res, next){
    var eventID = req.params.id;
    res.render('view-event', { title: 'photofest', eventID: eventID} );
});

router.get('/create-story/:id', function(req, res, next) {
    var eventID = req.params.id;
    res.render('create-story', { title: 'photofest', eventID: eventID});
});

router.post('/', function(req, res, next) {
  res.render('create-story', { title: 'photofest'})
})


class Event{
  constructor (title, description, date, creator) {
    this.title = title;
    this.desciption= description;
    this.date= date;
    this.creator= creator;
  }
}

module.exports = router;
