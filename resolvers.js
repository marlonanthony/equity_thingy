const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') 

const User = require('./models/user')
const keys = require('./config/keys_dev')

const pairings = [
    {
        id: 1,
        pair: 'EUR/USD',
        lotSize: 100000,
        purchasedAt: 1.2233,
        soldAt: 1.4444,
        pipDif: 0.2211,
        profitLoss: 22110
    },
    {
        id: 2,
        pair: 'GBP/USD',
        lotSize: 100000,
        purchasedAt: 1.2233,
        soldAt: 1.4444,
        pipDif: 0.2211,
        profitLoss: 22110
    },

]
const PAIR = []

const resolvers = {
    Query: {
        currencyPairs: async () => {
            try {
                return pairings.map(val => val) 
            } catch(err) { throw err }
        },
        currencyPair: async (_, {id}) => {
            try {
                const res = await pairings.map(pair => {
                    if(pair.id == id) {
                        return pair
                    }
                })
                return res
            }
            catch (err) { console.log(err) }
        },
        user: async (_, { id }) => {
            try {
                const user = await User.findById(id) 
                return user
            } catch (err) { console.log(err) }
        },
        users: async () => {
            try {
                const response = await User.find() 
                return response.map(res => res) 
            } catch (err) { console.log(err) }
        }
    },

    Mutation: {
        createUser: async (_, { email, password }) => {
            try {
                const existingUser = await User.findOne({ email })
                if(existingUser) { throw new Error('User exists already') }
                const hashedPassword = await bcrypt.hash(password, 12)
                const user = new User({
                    email,
                    password: hashedPassword
                })
                const res = await user.save()
                return {
                    email,
                    id: res._id 
                }
            }
            catch(err) { throw err }
        },
        login: async (_, { email, password }) => {
            try {
                const user = await User.findOne({ email })
                if(!user) { throw new Error('User does not exist!') }
                const isEqual = await bcrypt.compare(password, user.password)
                if(!isEqual) { throw new Error('Password is incorrect') }
                const token = await jwt.sign({ id: user.id }, 'key', {
                    expiresIn: '1h' 
                })
                return { userId: user.id, token, tokenExpiration: 1 }
            }
            catch (err) { console.log(err) }
        },
        buyPair: async (_, args, req) => {
            const pairing = {
                id: Math.random().toString(),
                pair: args.pair,
                lotSize: args.lotSize,
                purchasedAt: args.purchasedAt,
                soldAt: args.soldAt,
                pipDif: args.pipDif,
                profitLoss: args.pipDif * args.lotSize
            }
            PAIR.push(pairing)
            return pairing 
        },
        // buyEquity: async (args, req) => {
        //     if(!req.isAuth) { throw new Error('Unauthenticated') }
        //     const event = new Event({
        //         title: args.eventInput.title,
        //         description: args.eventInput.description,
        //         price: +args.eventInput.price,
        //         date: new Date(args.eventInput.date),
        //         creator: req.userId
        //     })
        //     let createdEvent
        //     try {
        //         const res = await event.save()
        //         createdEvent = transformEvent(res) 
        //         const creator = await User.findById(req.userId)
        //         if(!creator) { throw new Error('User not found.') }
        //         creator.createdEvents.push(event) 
        //         await creator.save() 
        //         return createdEvent 
        //     }
        //     catch(err) {
        //         console.log(err)
        //         throw err 
        //     }
        // }
    }
}

module.exports = resolvers