const { ApolloServer } = require('apollo-server') 
const mongoose = require('mongoose') 
// const jwt = require('jsonwebtoken')

const typeDefs = require('./schema') 
const resolvers = require('./resolvers') 
const keys = require('./config/keys_dev')
// const User = require('./models/user')
// const isAuth = require('./middleware/is-auth')

const server = new ApolloServer({
    context: async ({ req }) => {
        // get token from headers
        // verify and decode token
        // use user id to find and return user, placing user on context
        // const token = await req.headers.authorization || '',
        //       decodedToken = await jwt.verify(token, keys.secretOrKey),
        //       id = decodedToken.id
        // const user = await User.findById(id) 
        // return user && { ...user, password: null } 
    },
    typeDefs, 
    resolvers 
})

mongoose
.connect(`mongodb+srv://${keys.mongoUsername}:${keys.mongoPassword}@cluster0-qpcr4.mongodb.net/test?retryWrites=true`)
.then(() => { 
    server.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`)
    })
}).catch(err => console.log(err))