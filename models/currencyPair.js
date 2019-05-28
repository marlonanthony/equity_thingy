const mongoose = require('mongoose') 
const Schema = mongoose.Schema

const pairSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
    pair: {
        type: String,
        required: true 
    },
    lotSize: {
        type: Number,
        required: true 
    },
    purchasedAt: {
        type: Number,
        required: true 
    },
    soldAt: {
        type: Number,
    },
    pipDif: {
        type: Number,
    },
    profitLoss: {
        type: Number
    },
    open: {
        type: Boolean,
        required: true 
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Pair', pairSchema) 