const { model, Schema} = require('mongoose')

const postSchema = new Schema ({
    username: String,
    contains: String,
    datePosted: String,
    comments: [{
        username: String,
        contains: String,
        datePosted: String,
    }],
    likes: [{
        username: String,
        datePosted: String
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

module.exports = model('Post', postSchema);