const mongoose = require('mongoose') 
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true 
    },
    password: {
        type: String,
        required: true 
    },
    bankroll: {
        type: Number,
        default: 100000000
    },
    currencyPairs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Pair'
        }
    ]
})

module.exports = mongoose.model('User', userSchema)