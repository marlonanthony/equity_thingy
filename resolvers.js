const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') 

const User = require('./models/user')

const users = [{
    id: '1',
    email: 'mad1083@gmail.com',
    equities: [
        {
            id: '1',
            purchasedPrice: '1.1151',
            lotSize: '100000'
        },
        // {
        //     id: '2',
        //     purchasedPrice: '1.'
        // }
    ]
  },
]

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
        users: () => {
            return users
        },
        user: (root, { id }) => {
            return users.find(user => user.id === id) 
        },
    },

    Mutation: {
        createUser: async (args, req) => {
            try {
                const existingUser = await User.findOne({email: req.email})
                if(existingUser) { throw new Error('User exists already') }
                const hashedPassword = await bcrypt.hash(req.password, 12)
                const user = new User({
                    email: req.email,
                    password: hashedPassword
                })
                const res = await user.save()
                return {
                    email: res.email,
                    id: res._id 
                }
            }
            catch(err) { throw err }
        },
        login: async (args, req) => {
            try {
                const user = await User.findOne({ email: req.email })
                if(!user) { throw new Error('User does not exist!') }
                const isEqual = await bcrypt.compare(req.password, user.password)
                if(!isEqual) { throw new Error('Password is incorrect') }
                const token = jwt.sign({ id: user.id, email: user.email }, 'superdupersecretkey', {
                    expiresIn: '1h' 
                })
                return token
                // return { id: user.id, email: user.email, token, tokenExpiration: 1 }
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