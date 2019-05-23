const { ApolloServer } = require('apollo-server') 
const mongoose = require('mongoose') 

const typeDefs = require('./schema') 
const resolvers = require('./resolvers') 

const server = new ApolloServer({ 
    context: async ({req}) => {
        console.log(req.headers)
    },
    typeDefs, 
    resolvers 
})

mongoose
.connect(`mongodb+srv://marlon:marlon123456@cluster0-qpcr4.mongodb.net/test?retryWrites=true`)
.then(() => {
    server.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`)
    })
})