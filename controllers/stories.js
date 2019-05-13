var Story = require('../models/stories');
var ObjectId = require('mongodb').ObjectId;

/**
 * Get story data from form and insert story to the database
 * @param req
 * @param res
 */
exports.insertStory = function (req, res) {
    var storyData = req.body;
    var eventID = storyData.eventID;
    var objectID = new ObjectId(eventID);
    if (storyData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        var story = new Story({
            eventID: objectID,
            storyDescription: storyData.storyDescription,
            storyImage: storyData.storyImage,
            username: storyData.username,
        });
        console.log('received: ' + story);

        story.save(function (err, results) {
            console.log(results._id);
            if (err)
                res.status(500).send('Invalid data!');
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(storyData));
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}