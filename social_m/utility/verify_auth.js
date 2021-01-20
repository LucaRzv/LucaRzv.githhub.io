const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const {AuthenticationError} = require('apollo-server');

const { key } = require('../sensitive');

module.exports = (context) => {
    // context will be an object with headers to verify correct user
    const header = context.req.headers.authorization;

    if(header) {
        // extract token
        const token = header.split('UserToken')[1];
        if(token) {
            try {
                // verify token
                // const _user = jwt.verify(token, key);
                const _user = jwt_decode(token)
                return _user;
            }
            catch(err) {
                throw new AuthenticationError('Token Error!');
            }
        }
        throw new Error('Authentication token must be  \' UserToken [token]');
    }
    throw new Error('Authentication header must be provided!');
}