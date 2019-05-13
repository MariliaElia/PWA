var Event = require('../models/events');
var Story = require('../models/stories');
var ObjectId = require('mongodb').ObjectId;

exports.getAllEvents = function (req, res) {
    try {
        Event.find(
            function (err, events) {
                if (err)
                    res.status(500).send('Invalid data!');
                res.render('map', { title: 'photofest', events: events});
            });
    }
    catch (e) {
        res.status(500).send('error ' + e);
    }
}
//Search for an event
exports.searchEvents = function (req, res) {
    var searchData = req.body;
    var eventName = searchData.eventName;
    var eventDate = searchData.date;
    try {
        if ((eventName != "" ) && (eventDate != "")) {
            Event.find({title: eventName, date: eventDate},
                function (err, events) {
                    if (err)
                        res.status(500).send('Invalid data!');

                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(events));
                });
        } else if ((eventDate == "") && (eventName!= "")) {
            Event.find({title: eventName},
                function (err, events) {
                    if (err)
                        res.status(500).send('Invalid data!');

                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(events));
                });
        } else if ((eventDate != "") && (eventName == "")){
            Event.find({date: eventDate},
                function (err, events) {
                    if (err)
                        res.status(500).send('Invalid data!');

                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(events));
                });
        } else {
            var events = '';

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(events));
        }


    }
    catch (e) {
        res.status(500).send('error ' + e);
    }
}

//Display stories of event currenlty displayed
exports.getEventData = function (req, res) {
    var eventID = req.params.id;
    var objectID = new ObjectId(eventID);
    try {
        Event.findOne({_id: objectID},
            function (err, event) {
                if (err)
                    res.status(500).send('Invalid data!');
                var eventTitle = event.title;
                Story.find({eventID: eventID},
                    function (err, stories) {
                        if(err)
                            res.status(500).send('Invalid data!');
                        res.render('view-event', {title: 'photofest', eventID: eventID, eventTitle: eventTitle, stories: stories});
                    })
            });
    }
    catch (e) {
        res.status(500).send('error ' + e);
    }
}

//Get 5 latest events in the database and display then in index page
exports.getEvents = function (req, res) {
    var eventNum = 5;
    try {
        Event.find(
            function (err, events) {
                if (err)
                    res.status(500).send('Invalid data!');
                if (events.length > 5) {
                    events =  events.slice(Math.max(events.length - eventNum, 0));
                }
                res.render('index', { title: 'photofest', events: events});
            });
    }
    catch (e) {
        res.status(500).send('error ' + e);
    }
}

//Get Events created by the current user logged in
exports.getUserEventsStories = function (req, res) {
    var userData = req.body;
    var username = userData.username;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        Event.find({username: username},
            'title description date username',
            function (err, events) {
                if(err)
                    res.status(500).send('Invalid data!');
                Story.find({username: username},
                    function (err, stories) {
                        if (err)
                            res.status(500).send('Invalid data!');
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({events: events,stories: stories}));
                    })
            })
    } catch (e) {
        res.status(500).send('error '+ e);
    }

}

//Insert Event in the database
exports.insertEvent = function (req, res) {
    var eventData = req.body;
    if (eventData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        var event = new Event({
            title: eventData.title,
            description: eventData.description,
            date: eventData.date,
            latitude: eventData.latitude,
            longitude: eventData.longitude,
            username: eventData.username
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