var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('create-story', { title: 'photofest', eventName:'Perk is for real!'});
});

module.exports = router;