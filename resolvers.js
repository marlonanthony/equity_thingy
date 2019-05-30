const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') 

const User = require('./models/user')
const Pair = require('./models/currencyPair') 
// const keys = require('./config/keys_dev')

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
        sellPair: async (_, args, req) => {
            try {
                const pair = await Pair.findById(args.id)
                const pipDifFloat = (args.soldAt - pair.purchasedAt).toFixed(4)
                pair.soldAt = args.soldAt
                pair.pipDif = pipDifFloat 
                pair.profitLoss = pipDifFloat * pair.lotSize
                pair.open = false 
                const savedPair = await pair.save()
                const user = await User.findById(savedPair.user)
                user.bankroll += savedPair.profitLoss
                await user.save()

                const success = true,
                      message = `${user.name} you've sold ${savedPair.pair} for a profit/loss of ${savedPair.profitLoss}.`
                return { success, message, currencyPair: savedPair }
            } catch (err) { throw err }
        },
    },

}

module.exports = resolvers