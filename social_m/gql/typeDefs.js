const gql = require('graphql-tag');

// schemas define what a resolver should populate

module.exports = gql`
    type Post {
        id: ID!
        username: String!
        contains: String!
        datePosted: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commCount: Int!
    }
    type Comment {
        id: ID!
        datePosted: String!
        username: String!
        contains: String!
    }
    type Like {
        id: ID!
        username: String!
        dateLiked: String
    }
    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        dateCreated: String!
    }
    input Register {
        username: String!
        password: String!
        confirm_pass: String!
        email: String!
        
    }
    type Query {
        getPosts: [Post]
        getPost(postID: ID!): Post!
    }
    type Mutation {
        register(registerInput: Register): User!
        login(email: String!, password: String!): User!
        createPost(contains: String!): Post!
        deletePost(postID: ID!): String!
        createComment(postID: ID!, contains: String!): Post!
        deleteComment(postID: ID!, commentID: ID!): Post!
        likePost(postID: ID!): Post!
    }
`;