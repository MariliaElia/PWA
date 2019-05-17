var Story = require('../models/stories');
var ObjectId = require('mongodb').ObjectId;

/**
 * insertStory
 * Get story data from form and insert story to the database
 * @param req
 * @param res
 */
exports.insertStory = function (req, res) {
    var storyData = req.body;
    var eventID = storyData.eventID;
    var objectID = new ObjectId(eventID);
    var user = req.user;
    var username = user.username;

    var imageBlob = req.body.imgdata;

    if (storyData.storyDescription == "") {
        res.setHeader('Content-Type', 'text/html');
        res.send(JSON.stringify({data: "missing"}));
    }
    else {
        try {
            var story = new Story({
                eventID: objectID,
                storyDescription: storyData.storyDescription,
                storyImage: imageBlob,
                username: username,
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
}


/**
 * getStoryData
 * Get story data from database
 * @param req
 * @param res
 */
exports.getStoryData = function (req, res) {
    var storyID = req.params.id;
    var objectID = new ObjectId(storyID);
    var user = req.user;

    try {
        //Find story with given id
        Story.findOne({_id: objectID},
            function (error, story) {
                if (error)
                    res.status(500).send('invalid story id');

                //Render view-story page with story data and comments
                res.render('view-story', {title: 'photofest', story: story, user: user, comments: story.comments, storyId: objectID});
            });
    }
    catch (e) {
        res.status(500).send('error ' + e);
    }
}

/**
 * addComments
 * Get comments from form and insert add to comments array in the story
 * @param req
 * @param res
 */
exports.addComments = function (req, res) {
    var commentData = req.body;
    var storyData = commentData.storyID;
    var objectID = new ObjectId(storyData);
    var username = req.user.username;

    //Comment with username added
    var comment = commentData.comment + " -" + username;

    if (commentData == null) {
        res.status(403).send('No data sent!')
    }

    try {
        //Add comment to story with given id
        Story.updateOne({_id: objectID}, {$push: {comments: comment}},
            function (error, story) {
                if (error)
                    res.status(500).send('invalid story id');
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};