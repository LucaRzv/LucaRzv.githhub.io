const postsRes = require('./posts');
const usersRes = require('./users')
const commentsRes = require('./comments')

module.exports = {
    // each time any mutation or query that returns a post will go through this post modifier 
    Post: {
        likeCount: (parent) => parent.likes.length, 
        commCount: (parent) => parent.comments.length
    },
    Query: {
        ...postsRes.Query
    },
    Mutation: {
        ...usersRes.Mutation, 
        ...postsRes.Mutation,
        ...commentsRes.Mutation
    }
}