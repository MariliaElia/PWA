var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('create-event', { title: 'photofest'});
});

module.exports = router;