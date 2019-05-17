var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * event model for mongodb
 * @type {Mongoose}
 */
var Event = new Schema(
    {
        title: {type: String, required: true, max: 100},
        description: {type: String, required: true, max: 100},
        date: {type: String, required: true, max: 100},
        latitude: {type: Number, required: true},
        longitude: {type: Number, required: true},
        username: {type: String, required: true, max: 100}
    }
);

var eventModel = mongoose.model('Event', Event );

module.exports = eventModel;