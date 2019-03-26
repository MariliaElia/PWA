var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));

router.get('/', function(req, res, next) {
    res.render('view-event', {title: 'photofest'});
});

module.exports = router;