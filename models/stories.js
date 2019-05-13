var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Story = new Schema(
    {
        eventID: {type: Schema.Types.ObjectId, required: true},
        storyDescription: {type: String, required: true, max: 100},
        storyImage: {data: Buffer, contentType: String},
        username: {type: String, required: true, max: 100}
    }
);

var storyModel = mongoose.model('Story', Story );

module.exports = storyModel;