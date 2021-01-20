const {AuthenticationError, UserInputError} = require('apollo-server');

const Post = require('../models/post')
const verifyAuth = require('../../utility/verify_auth');

module.exports = {
    Query: {
        async getPosts() {
            try {
                // find and sort posts by date created
                const posts = await Post.find().sort({datePosted: -1});
                return posts;
            }
            catch(err) {
                throw new Error(err);
            }
        },

        async getPost(parent,{ postID }) {
            try {
                const _post = await Post.findById(postID);
                if (_post) {
                    return _post;
                }
                else {
                    throw new Error('Post not found!');
                }
            }
            catch(err) {
                throw new Error(err);
            }
        }        
    },
    Mutation: {
        // use context to access the header and make sure user is authenticated
        async createPost(parent, { contains }, context) {
            const _user = verifyAuth(context);

            //check it's not empty
            if(contains.trim() === '') {
                throw new Error('Post is empty!')
            }

            const _post = new Post({ 
                contains, 
                user: _user._id,
                username: _user.username,
                datePosted: new Date().toISOString()
            });

            const post = await _post.save();

            return post
        },

        async deletePost(parent, { postID }, context) {
            const _user = verifyAuth(context);

            try {
                const _post = await Post.findById(postID);

                if(_user.username === _post.username) {
                    await _post.delete();
                    return 'Post was deleted!'
                }
                else {
                    throw new AuthenticationError("Can't delete post!")
                }
            }
            catch(err) {
                throw new Error(err);
            }
        },

        async likePost(parent, { postID }, context) {
            const { username } = verifyAuth(context);

            try {
                const _post = await Post.findById(postID);
                
                // user can have only one like so if it has it already, delete it
                if(_post.likes.find(like => like.username === username)) {
                    // remove just the one
                    _post.likes = _post.likes.filter(like => like.username !== username);
                }
                //like post
                else {
                    _post.likes.push({
                        username,
                        dateLiked: new Date().toISOString()
                    })
                }
                await _post.save();
                return _post;
            }
            catch(err) {
                throw new UserInputError("Post not found!")
            }
            
        }
    }   
}  