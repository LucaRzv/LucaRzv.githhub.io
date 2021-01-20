const { UserInputError } = require('apollo-server');
const {AuthenticationError} = require('apollo-server');

const Post = require('../models/post');
const verifyAuth = require('../../utility/verify_auth');
const { Error } = require('mongoose');

module.exports = {
    Mutation: {
        async createComment(parent, { postID, contains }, context){
            const { username } = verifyAuth(context);

            if (contains.trim() === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        contains: 'Comment is empty!'
                    }
                }) 
            }

            const _post = await Post.findById(postID);

            if(_post) {
                //insert comments at the start 
                _post.comments.unshift({
                    contains, 
                    username,
                    datePosted: new Date().toISOString()
                })

                await _post.save(); 
                return _post;
            }
            else {
                throw new UserInputError("Can't find post!")
            }
        },
        async deleteComment(parent, {postID, commentID}, context){
            const { username } = verifyAuth(context);

            try {
                // find post that has the comment and then index of the comment in the array, if it matches
                const _post = await Post.findById(postID);
                const commIdx = _post.comments.findIndex(comm => comm.id === commentID);

                // can delete only if username matches the one from the token
                if(_post.comments[commIdx].username === username) {
                    _post.comments.splice(commIdx, 1);
                    await _post.save();
                    return _post;
                }
                else {
                    //just for safety
                    throw new AuthenticationError("Can't delete others comments!")
                }
            }
            catch(err){
                throw new Error(err);
            }
        }
    }
}