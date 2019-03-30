var express = require('express');
var router = express.Router();

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

router.post('/', function(req, res, next) {
  res.render('create-story', { title: 'photofest'})
});




class Event{
  constructor (title, description, date, creator) {
    this.title = title;
    this.desciption= description;
    this.date= date;
    this.creator= creator;
  }
}

module.exports = router;
