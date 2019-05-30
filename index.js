const { ApolloServer } = require('apollo-server') 
const mongoose = require('mongoose') 
const jwt = require('jsonwebtoken')
const CurrencyAPI = require('./datasources/currencies')
const UserAPI = require('./datasources/user')
const typeDefs = require('./schema') 
const resolvers = require('./resolvers') 
const keys = require('./config/keys_dev')
// const User = require('./models/user')
// const isAuth = require('./middleware/is-auth')

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    dataSources: () => ({
        currencyAPI: new CurrencyAPI(),
        userAPI: new UserAPI() 
    }),
    context: async ({ req }) => {
        // get token from headers
        // verify and decode token
        // use user id to find and return user, placing user on context
        const token = await req.headers.authorization || ''
        if(token) console.log(token)
        // const decodedToken = await jwt.verify(token, keys.secretOrKey) || ''
        // const id = decodedToken.id || ''
        // const user = await User.findById(id) || ''
        // return user && { ...user, password: null } 
    },
})

mongoose
.connect(`mongodb+srv://${keys.mongoUsername}:${keys.mongoPassword}@cluster0-qpcr4.mongodb.net/test?retryWrites=true`)
.then(() => { 
    server.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`)
    })
}).catch(err => console.log(err))