var ObjectId = require('mongodb').ObjectID;
var Counter = require('../models/counter');


exports.insertEventCount = function (req, res) {
    try {
        var eventCount = new Counter({
            _id: 'eventId',
            seq: 0
        });
        console.log('received: ' + eventCount);

        eventCount.save(function (err, results) {
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

exports.insertStoryCount = function (req, res) {
    try {
        var count = new Counter({
            _id: 'storyId',
            seq: 0
        });
        console.log('received: ' + count);

        count.save(function (err, results) {
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
