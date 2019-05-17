var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

var mongoDB = 'mongodb://localhost:27017/photofestDB';

mongoose.Promise = global.Promise;
mongoose.connect(mongoDB);
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

