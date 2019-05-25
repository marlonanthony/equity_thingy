const { ApolloServer } = require('apollo-server') 
const mongoose = require('mongoose') 
const jwt = require('jsonwebtoken')

const typeDefs = require('./schema') 
const resolvers = require('./resolvers') 
const isAuth = require('./middleware/is-auth')

const server = new ApolloServer({
    context: async ({ req }) => {
        const token = await req.headers.authorization || '' 
        const userId = await req.headers.userid || '' 
        console.log(req.headers) 
        console.log(token)
        console.log(userId)

        // const user = getUser(token) 

        // return { user }
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