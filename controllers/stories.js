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
    targetDirectory = './uploads/' + eventID + '/';
    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory);
    }
    console.log('wants to save file to ' + targetDirectory + 'story');
    var imageBlob = req.body.imgdata;
    var storyImage = imageBlob.replace(/^data:image\/\w+;base64,/,"");
    var buf = new Buffer(storyImage, 'base64');

    fs.writeFile(targetDirectory + 'story' + '.png', buf, (err) => {
        if (err) throw err;
        console.log('the file has been saved');
    });

    var storyFilePath = targetDirectory + 'story';
    console.log('filepath created');

    var objectID = new ObjectId(eventID);
    var str = "hello world";
    if (storyData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        var story = new Story({
            eventID: objectID,
            storyDescription: storyData.storyDescription,
            storyImage: imageBlob,
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

exports.getStoryData = function (req, res) {
    var storyID = req.params.id;
    var objectID = new ObjectId(storyID);
    try {
        Story.findOne({_id: objectID},
            function (error, story) {
                if (error)
                    res.status(500).send('invalid story id');
                res.render('view-story', {title: 'photofest', story: story});
            });
    }
    catch (e) {
        res.status(500).send('error ' + e);
    }
}
