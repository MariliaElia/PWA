var Event = require('../models/events');
var ObjectId = require('mongodb').ObjectID;

var counter = require('../models/counter');

exports.getEventData = function (req, res) {
    try {
        Event.findOne({_id: req.params.id},
            function (err, event) {
                if (err)
                    res.status(500).send('Invalid data!');
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(event));
            });
    }
    catch (e) {
        res.status(500).send('error ' + e);
    }
}

exports.getAllEvents = function (req, res) {
    try {
        Event.find({},
            function (err, events) {
                if (err)
                    res.status(500).send('Invalid data!');
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(events));
            });
    }
    catch (e) {
        res.status(500).send('error ' + e);
    }
}

exports.insertEvent = function (req, res) {
    var eventData = req.body;
    if (eventData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        var event = new Event({
            //eventId: getNextSequenceValue('eventId'),
            title: userData.title,
            description: userData.description,
            date: userData.date,
            username: userData.username,
            latitude: userData.latitude,
            longitude: userData.longitude
        });
        console.log('received: ' + event);

        event.save(function (err, results) {
            console.log(results._id);
            if (err)
                res.status(500).send('Invalid data!');

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(event));
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}

/*
function getId(seqName) {

}
*/

function getNextSequenceValue(sequenceName){

    var sequenceDocument = counter.findByIdAndUpdate({
        query:{_id: sequenceName },
        update: {$inc:{sequence_value:1}},
        new:true
    });

    return sequenceDocument.sequence_value;
}