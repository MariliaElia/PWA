var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var User = new Schema(
    {
        username: {type: String, required: true, max: 100},
        name: {type: String, required: true, max: 100},
        email: {type: String, required: true, max: 100},
        password: {type: String, required: true, max: 100}
    }
);

var userModel = mongoose.model('User', User );

module.exports = userModel;