const { model, Schema} = require('mongoose')


const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    dateCreated: String,
})

// this should create a collection in the database named user and using the userSchema
module.exports = model('user', userSchema);