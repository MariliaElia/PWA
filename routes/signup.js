var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));

var user = require('../controllers/users');

router.get('/', function(req, res, next) {
    res.render('signup', { title: 'photofest'});
});

router.post('/', user.insert);

module.exports = router;