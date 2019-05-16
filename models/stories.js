var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Story = new Schema(
    {
        eventID: {type: Schema.Types.ObjectId, required: true},
        storyDescription: {type: String, max: 100},
        storyImage: {type: String},
        username: {type: String, required: true, max: 100},
        comments: {type: Array, default: []}
    }
);

var storyModel = mongoose.model('Story', Story );

module.exports = storyModel;