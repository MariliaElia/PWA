var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

var User = new Schema(
    {
        username: {type: String, required: true, max: 100},
        name: {type: String, required: true, max: 100},
        email: {type: String, required: true, max: 100},
        password: {type: String, required: true, max: 100}
    }
);

//Encrypts password before saving to database
User.pre('save', function (next) {
    let user = this;
    console.log('saving password');
    bcrypt.genSalt(10, function (err, salt) {
        if (err) console.error(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
            next();
        })
    });
});

var userModel = mongoose.model('User', User );

module.exports = userModel;