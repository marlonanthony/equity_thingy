const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') 

const User = require('./models/user')

const resolvers = {
    Query: {
        equities: async () => {
            try {
                const equities = await Equity.find()
                return equities.map(equity => {
                    return equity
                })
            }
            catch(err) {
                throw err 
            }
        },
        user: (_, { id }) => {
            return users.find(user => user.id === id) 
        },
        users: async () => {
            const response = await User.find() 
            return response.map(res => res) 
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
                const token = await jwt.sign({ id: user.id }, 'superdupersecretkey', {
                    expiresIn: '1h' 
                })
                return { userId: user.id, token, tokenExpiration: 1 }
            }
            catch (err) { console.log(err) }
        },
        buyEquity: async (args, req) => {
            if(!req.isAuth) { throw new Error('Unauthenticated') }
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: req.userId
            })
            let createdEvent
            try {
                const res = await event.save()
                createdEvent = transformEvent(res) 
                const creator = await User.findById(req.userId)
                if(!creator) { throw new Error('User not found.') }
                creator.createdEvents.push(event) 
                await creator.save() 
                return createdEvent 
            }
            catch(err) {
                console.log(err)
                throw err 
            }
        }
    }
}

module.exports = resolvers