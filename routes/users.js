var express = require('express');
var router = express.Router();
var passport = require('passport');

var auth = require('../config/auth');
var user = require('../controllers/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
