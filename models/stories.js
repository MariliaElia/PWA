var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Story = new Schema(
    {
        //storyId: {type: Number, required: true, unique: true},
        eventID: {type: Number, required: true},
        storyDescription: {type: String, required: true, max: 100},
        storyImage: {type: String},
        username: {type: String, required: true, max: 100}
    }
);

var storyModel = mongoose.model('Story', Story );

module.exports = storyModel;