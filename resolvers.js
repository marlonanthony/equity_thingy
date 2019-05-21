// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken') 

// const User = require('./datasources/models/user')

const users = [{
    id: '1',
    email: 'mad1083@gmail.com',
    equities: [
        {
            id: '1',
            purchasedPrice: '1.1151',

        },
        // {
        //     id: '2',
        //     purchasedPrice: '1.'
        // }
    ]
  },
//   {
//     id: '2',
//     email: 'tonystark@gmail.com',
//     equities: [{
//       id: '3',
//       purchasedPrice: 'Industrial design'
//     },{
//       id: '4',
//       purchasedPrice: 'Robotic fashion'
//     }]
//   }
]

const resolvers = {
    Query: {
        users: () => {
            return users 
        },
        user: (root, { id }) => {
            return users.find(user => user.id === id) 
        },
        // createUser: async (args) => {
        //     try {
        //         const existingUser = await User.findOne({email: args.userInput.email})
        //         if(existingUser) { throw new Error('User exists already') }
        //         const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
        //         const user = new User({
        //             email: args.userInput.email,
        //             password: hashedPassword
        //         })
        //         const res = await user.save()
        //         return { ...res._doc, password: null }
        //     }
        //     catch(err) { throw err }
        // },
        // login: async ({ email, password }) => {
        //     try {
        //         const user = await User.findOne({ email })
        //         if(!user) { throw new Error('User does not exist!') }
        //         const isEqual = await bcrypt.compare(password, user.password)
        //         if(!isEqual) { throw new Error('Password is incorrect') }
        //         const token = jwt.sign({ userId: user.id, email: user.email }, 'superdupersecretkey', {
        //             expiresIn: '1h' 
        //         })
        //         return { userId: user.id, token, tokenExpiration: 1 }
        //     }
        //     catch (err) {
        //         console.log(err) 
        //     }
        // }
    }
}

module.exports = resolvers