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
    equities: [
        {
            purchasePrice: { type: Number, required: true, },
            soldPrice: { type: Number },
            lotSize: { type: Number, required: true }
        }
    ]
})

module.exports = mongoose.model('User', userSchema)