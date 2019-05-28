const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') 

const User = require('./models/user')
const Pair = require('./models/currencyPair') 
const keys = require('./config/keys_dev')

// const populateUser = async (userId) => {
//     try {
//         const user = await User.findById(userId) 
//         console.log(user) 
//         return {
//             user
//         }
//     } catch (err) { throw err }
// }

// const populatePairs = async pairIds => {
//     try {
//         const pairs = await Pair.find({ _id: { $in: pairIds } })
//         console.log(pairs) 
//         return pair.map(pair => {
//             return {
//                 ...pair,
//                 user: populateUser.bind(this, pair.user)
//             }
//         })
//     } catch(err) { throw err }
// }

const resolvers = {
    Query: {
        currencyPairs: async () => {
            try {
                const result = await Pair.find() .populate('user')
                return [...result]
                // return result.map(pair => {
                //     console.log(pair)
                //     return {
                //         ...pair,
                //         user: populateUser.bind(this, pair.user)
                //     }
                // })
            } catch(err) { throw err }
        },
        currencyPair: async (_, {id}) => {
            try {
                const result = await Pair.findById(id) 
                return result 
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
                const response = await User.find().populate('currencyPairs')
                return [...response]
            } catch (err) { console.log(err) }
        }
    },

    Mutation: {
        createUser: async (_, { email, password, name }) => {
            try {
                const existingUser = await User.findOne({ email })
                if(existingUser) { throw new Error('User exists already') }
                const hashedPassword = await bcrypt.hash(password, 12)
                const user = new User({
                    name,
                    email,
                    password: hashedPassword
                })
                const res = await user.save()
                const { _id, bankroll, createdAt } = res
                return {
                    id: _id,
                    name,
                    email,
                    bankroll,
                    createdAt,
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
            try {
                const pipDifFloat = (args.soldAt - args.purchasedAt).toFixed(4)
                
                const newPair = new Pair({
                    pair: args.pair || '',
                    lotSize: args.lotSize || 0,
                    purchasedAt: args.purchasedAt || 0,
                    soldAt: args.soldAt || 0,
                    pipDif: pipDifFloat || 0,
                    profitLoss: pipDifFloat * args.lotSize,
                    user: "5ceb8f65d49cd407e13919c7"
                })
                const result = await newPair.save()
                const user = await User.findById('5ceb8f65d49cd407e13919c7')
                if(!user) throw new Error('User doesn\'t exist')
                user.currencyPairs.push(newPair)
                user.bankroll -= args.lotSize
                await user.save() 
                return result 
            } catch (err) { 
                console.log(err) 
                throw err
            }
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