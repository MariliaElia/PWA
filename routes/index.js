var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let eventPosts = [
    {
      title: 'Perk is for real!',
      description: '...',
      author: 'Aaron Larner',
      publishedAt: new Date('2016-03-19'),
      createdAt: new Date('2016-03-19')
    },
    {
      title: 'Development continues...',
      description: '...',
      author: 'Aaron Larner',
      publishedAt: new Date('2016-03-18'),
      createdAt: new Date('2016-03-18')
    },
    {
      title: 'Welcome to Perk!',
      description: '...',
      author: 'Aaron Larner',
      publishedAt: new Date('2016-03-17'),
      createdAt: new Date('2016-03-17')
    }
  ]
  res.render('index', { title: 'photofest', events: eventPosts});

  /*//get random event for now
  const event = getEvents();
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(event));*/
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
