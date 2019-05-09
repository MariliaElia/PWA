var mongoose = require('mongoose');
var counter = require('../controllers/events');

var Schema = mongoose.Schema;

var Event = new Schema(
    {
        eventId: {type: Number, required: true, unique: true},
        title: {type: String, required: true, max: 100},
        description: {type: String, required: true, max: 100},
        date: {type: String, required: true, max: 100},
        username: {type: String, required: true, max: 100},
        latitude: {type: Number, required: true},
        longitude: {type: Number, required: true}
    }
);


Event.pre('save', function(next) {
        console.log("in counter function")
        var doc = this;
        counter.findByIdAndUpdate({_id: 'eventId'}, {$inc: { seq: 1} }, function(error, counter)   {
                if(error)
                        return next(error);
                doc.eventId = counter.seq;
                next();
        });
});


var eventModel = mongoose.model('Event', Event );


module.exports = eventModel;