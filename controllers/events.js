var Event = require('../models/events');
var Story = require('../models/stories');
var ObjectId = require('mongodb').ObjectId;

/**
 * Get all the events in the database to show them on the map
 * @param req
 * @param res
 */
exports.getAllEvents = function (req, res) {
    try {
        Event.find(
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

/**
 * Gets the search data from form and searches the database to return
 * the appropriate results
 * @param req
 * @param res
 */
exports.searchEvents = function (req, res) {
    var searchData = req.body;
    var eventName = searchData.eventName;
    var eventDate = searchData.date;
    var noEvents = 'noEvents';
    try {
        if ((eventName != "" ) && (eventDate != "")) {
            Event.find({title: eventName, date: eventDate},
                function (err, events) {
                    if (err)
                        res.status(500).send('Invalid data!');
                    if (events.length > 0) {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(events));
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(noEvents));
                    }
                });
        } else if ((eventDate == "") && (eventName!= "")) {
            Event.find({title: eventName},
                function (err, events) {
                    if (err)
                        res.status(500).send('Invalid data!');
                    if (events.length > 0) {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(events));
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(noEvents));
                    }
                });
        } else if ((eventDate != "") && (eventName == "")){
            Event.find({date: eventDate},
                function (err, events) {
                    if (err)
                        res.status(500).send('Invalid data!');
                    if (events.length > 0) {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(events));
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(noEvents));
                    }
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


/**
 * Get the eventID of event currenlty displayed and
 * find the stories posted for that event
 * @param req
 * @param res
 */
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

/**
 * Find 5 latest events in the database and send them in index page
 * @param req
 * @param res
 */
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

/**
 * Find Events created by the current user logged in
 * @param req
 * @param res
 */
exports.getUserEventsStories = function (req, res) {
    //var userData = req.body;
    var username = req.user.username;

    //console.log(userData);
    console.log(username);

    if (username == null) {
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

/**
 * Get the eventID for the event the story is currently created and
 * find the title of that event
 * @param req
 * @param res
 */
exports.getEventTitle = function(req, res){
    var eventID = req.params.id;
    var objectID = new ObjectId(eventID);
    try {
        Event.findOne({_id: objectID},
        function (err, event) {
            if (err)
                res.status(500).send('Invalid data!');
            var eventTitle = event.title;
            res.render('create-story', {title: 'photofest', eventID: eventID, eventTitle: eventTitle});
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}

/**
 * Get event data from the form and add in the database
 * @param req
 * @param res
 */
exports.insertEvent = function (req, res) {
    var eventData = req.body;
    if (eventData.title == '' || eventData.description == '' || eventData.date == '' ||
        eventData.latitude == '') {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({data:"missing"}));
    }
    else {
        try {
            var event = new Event({
                title: eventData.title,
                description: eventData.description,
                date: eventData.date,
                latitude: eventData.latitude,
                longitude: eventData.longitude,
                username: req.user.username
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
}