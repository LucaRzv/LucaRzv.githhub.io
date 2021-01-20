const { ApolloServer } = require('apollo-server');

const mongoose = require('mongoose');

const { mongodb } = require('./sensitive.js');
const typeDefs = require('./gql/typeDefs');
const resolvers = require('./gql/resolvers');




const apServer = new ApolloServer({
    typeDefs,
    resolvers, 
    context: ({ req }) => ({req})
});

//connect server to database using mongoose
mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => {
        console.log('DB connected!')
        return apServer.listen({port: 3001})
        })
        .then(res => {
        console.log(`Server running at ${res.url}`)
    })
    


    