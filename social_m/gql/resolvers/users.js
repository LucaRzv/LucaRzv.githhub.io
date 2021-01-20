const bcrypt = require('bcryptjs');
const { Token } = require('graphql');
const token = require('jsonwebtoken');
// const token = require('njwt')
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../utility/validators');
const user = require('../models/user');
const { key } = require('../../sensitive');


// function to generate token
function generateToken(_user) {
    return token.sign({
                "id": _user.id,
                "email": _user.email,
                "username": _user.username
            }, key, {expiresIn: '5h'});
}


module.exports = {
    Mutation: {
        //resolvers can optionally accept four different arguments
        async register(parent, {registerInput: {username, email, password, confirmPassword}}, context, info) {
            // validate user data
            const {validationErrors, isValid} = validateRegisterInput(username, email, password, confirmPassword);
            if (!isValid) {
                throw new UserInputError('Errors', {validationErrors});
            }


            // make sure user doesn't already exist
            const _user = await user.findOne({username});
            if (_user) {
                throw new UserInputError('Username already exists!', {
                    // use this for frontend display
                    errors: {
                        username: 'This username already exists!'
                    }
                })
            }
            
            // make sure email is not already registered
            const _email = await user.findOne({email});
            if(_email) {
                throw new UserInputError('Email is already registered!', {
                    errors: {                        
                        email: 'This email is already registered!'                        
                    }
                })
            }


            // auth token is created but not used in data base

            // function to crypt password is asynchronous, meaning it needs to wait until response is returned

            password = await bcrypt.hash(password, 12);

            // create new user with the data
            const newUser = new user({
                email,
                username, 
                password,
                dateCreated: new Date().toISOString()
            });

            // save new user to database
            const res = await newUser.save();

            // create auth token
            const tkn = generateToken(res);
            console.log(tkn);
            const tokenStr = tkn.toString();        

            return {
                token: tokenStr,
                ...res._doc,
                id: res.id,
            }; 
            
        },

        // arguments are direct, no need to destructure from a typedef
        async login(parent, {email, password}) {
            const {loginValidationErrors, logIsValid} = validateLoginInput(email, password);
            const _user = await user.findOne({email});

            if (!logIsValid) {
                throw new UserInputError('Login Errors', { loginValidationErrors  })
            }

            if (!_user) {
                throw new UserInputError('Email not found!', { loginValidationErrors: { email: 'Email is not registered!' }})
            }

            // compare passwords to see if it's correct
            const matchPasswords = await bcrypt.compare(password, _user.password);
            
            if(!matchPasswords) {
                throw new UserInputError('Wrong password!', { loginValidationErrors: { password: 'Wrong password!' } });
            }

            const tkn = generateToken(_user);
            const tokenStr = tkn.toString();
            console.log(tkn)

            return {
                token: tokenStr,
                ..._user._doc,
                id: _user.id,
            }; 
        }
    }
}

