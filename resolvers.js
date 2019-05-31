const User = require('./models/user')
const Pair = require('./models/currencyPair') 

const resolvers = {
    Query: {
        currencyPairs: async () => {
            try {
                const result = await Pair.find().populate('user')
                return [...result]
            } catch(err) { throw err }
        },
        currencyPair: async (_, {id}) => {
            try {
                const result = await Pair.findById(id).populate('user') 
                return result 
            } catch (err) { console.log(err) }
        },
        user: async (_, { id }) => {
            try {
                const user = await User.findById(id).populate('currencyPairs')
                return user
            } catch (err) { console.log(err) }
        },
        users: async () => {
            try {
                const response = await User.find().populate('currencyPairs')
                return [...response]
            } catch (err) { console.log(err) }
        },
        currencyPairInfo: async (_, {fc, tc}, { dataSources }) => {
            const currencyPairs = await dataSources.currencyAPI.getCurrencyPair(fc, tc)
            return currencyPairs
        }
    },

    Mutation: {
        createUser: async (_, { email, password, name }, { dataSources }) => {
            try {
                const newUser = await dataSources.userAPI.createNewUser({ email, password, name }) 
                if(newUser) return newUser
            } catch(err) { throw err }
        },
        login: async (_, { email, password }, { dataSources }) => {
            try {
                const loggedInUser = await dataSources.userAPI.loginUser({ email, password })
                return loggedInUser
            } catch (err) { console.log(err) }
        },
        buyPair: async (_, {pair, lotSize, purchasedAt}, { dataSources, user }) => {
            try {
                const buy = await dataSources.userAPI.purchase({pair, lotSize, purchasedAt, user})
                return buy 
            } catch (err) { throw err }
        },
        sellPair: async (_, {id, soldAt}, { dataSources, user }) => {
            try {
                const sell = await dataSources.userAPI.closePosition({ id, soldAt, user })
                return sell     
            } catch (err) { throw err }
        },
    },

}

module.exports = resolvers