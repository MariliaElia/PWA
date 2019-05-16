var Story = require('../models/stories');
var ObjectId = require('mongodb').ObjectId;
var fs = require('fs-extra');

/**
 * Get story data from form and insert story to the database
 * @param req
 * @param res
 */
exports.insertStory = function (req, res) {
    var storyData = req.body;
    var eventID = storyData.eventID;
/*    targetDirectory = './uploads/' + eventID + '/';
    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory);
    }*/
    //console.log('wants to save file to ' + targetDirectory + 'story');
    var objectID = new ObjectId(eventID);
    var user = req.user;
    var username = user.username;

    /* targetDirectory = './uploads/' + eventID + '/';
     if (!fs.existsSync(targetDirectory)) {
         fs.mkdirSync(targetDirectory);
     }*/
    //console.log('wants to save file to ' + targetDirectory + 'story');
    var imageBlob = req.body.imgdata;
    //var storyImage = imageBlob.replace(/^data:image\/\w+;base64,/,"");
    //var buf = new Buffer(storyImage, 'base64');
   /* var storyImage = imageBlob.replace(/^data:image\/\w+;base64,/,"");
    var buf = new Buffer(storyImage, 'base64');

/*
    fs.writeFile(targetDirectory + 'story' + '.png', buf, (err) => {
        if (err) throw err;
        console.log('the file has been saved');
    });
*/

    //var storyFilePath = targetDirectory + 'story';
    //console.log('filepath created');
    //var storyFilePath = targetDirectory + 'story';
    //console.log('filepath created');

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
 * Get story data from database
 * @param req
 * @param res
 */
exports.getStoryData = function (req, res) {
    var storyID = req.params.id;
    var objectID = new ObjectId(storyID);
    var user = req.user;

    try {
        Story.findOne({_id: objectID},
            function (error, story) {
                if (error)
                    res.status(500).send('invalid story id');
                console.log(story.comments);
                res.render('view-story', {title: 'photofest', story: story, user: user, comments: story.comments, storyId: objectID});
            });
    }
    catch (e) {
        res.status(500).send('error ' + e);
    }
}

/**
 * Get comments from form and insert add to comments array in the story
 * @param req
 * @param res
 */
exports.addComments = function (req, res) {
    var commentData = req.body;
    var storyData = commentData.storyID;
    var objectID = new ObjectId(storyData);
    var username = req.user.username;

    var comment = commentData.comment + " -" + username;

    if (commentData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        console.log('in add comment function');
        Story.updateOne({_id: objectID}, {$push: {comments: comment}},
            function (error, story) {
                if (error)
                    res.status(500).send('invalid story id');
                console.log(comment);
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};