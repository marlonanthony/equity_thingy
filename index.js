const { ApolloServer } = require('apollo-server') 
const mongoose = require('mongoose') 
const jwt = require('jsonwebtoken')
const CurrencyAPI = require('./datasources/currencies')
const UserAPI = require('./datasources/user')
const typeDefs = require('./schema') 
const resolvers = require('./resolvers') 
const keys = require('./config/keys_dev')
const User = require('./models/user')

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    dataSources: () => ({
        currencyAPI: new CurrencyAPI(),
        userAPI: new UserAPI() 
    }),
    context: async ({ req }) => {
        try {
            const token = await (req.headers && req.headers.authorization) || ''
            const decodedToken = await jwt.verify(token, keys.secretOrKey) || ''
            const user = context.user || await User.findById(decodedToken.id)
            return { user }  
        } catch (err) { console.log(err) }
    },
})

mongoose
.connect(`mongodb+srv://${keys.mongoUsername}:${keys.mongoPassword}@cluster0-qpcr4.mongodb.net/test?retryWrites=true`)
.then(() => { 
    server.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`)
    })
}).catch(err => console.log(err))