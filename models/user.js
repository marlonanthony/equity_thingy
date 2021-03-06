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
    name: {
        type: String,
        required: true 
    },
    bankroll: {
        type: Number,
        default: 1000000,
        required: true
    },
    currencyPairs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Pair'
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)