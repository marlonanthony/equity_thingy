const { DataSource } = require('apollo-datasource')
const isEmail = require('isemail')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys_dev')

const User = require('../models/user') 
const Pair = require('../models/currencyPair') 

class UserAPI extends DataSource {
  constructor() {
    super()
  }

  // async willSendRequest(request) {
  //   request.headers.set('authorization', this.context.auth)
  //   console.log(this.context.auth)
  // }

  initialize(config) {
    this.context = config.context
  }

  
  async createNewUser({ email, password, name }) {
    try {
      if (!isEmail.validate(email)) { throw new Error('Invalide Email') }
      const existingUser = await User.findOne({ email })
      if(existingUser) { throw new Error('User exists already') }
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = await new User({
          name,
          email,
          password: hashedPassword
      })
      const res = await user.save()
      this.context.user = res 
      return { id: res._id, name, email }
    } catch (err) { throw err }
  }

  async loginUser({ email, password }) {
    try {
      const user = await User.findOne({ email })
      if(!user) { throw new Error('Email or password is incorrect!') }
      const isEqual = await bcrypt.compare(password, user.password)
      if(!isEqual) { throw new Error('Email or password is incorrect!') }
      const token = await jwt.sign({ id: user.id, email, name: user.name }, keys.secretOrKey, {
          expiresIn: '1h' 
      })
      this.context.user = user 
      // console.log(this.context)
      return { id: user.id, token, tokenExpiration: 1 }
    } 
    catch (err) { throw err }
  }

  async purchase({ pair, lotSize, purchasedAt, user }) {
    try {
      const newPair = new Pair({
        pair,
        lotSize,
        purchasedAt,
        open: true,
        user: user._id
      })
      const result = await newPair.save(),
            foundUser = await User.findById(user._id)
      if(!foundUser) throw new Error('User doesn\'t exist')
      if(foundUser.bankroll < lotSize) throw new Error('You do not have enough for this transaction!')
      foundUser.currencyPairs.unshift(newPair)
      foundUser.bankroll -= lotSize
      await foundUser.save() 
      const message = `Congrats ${foundUser.name}! You've purchased ${result.pair} at ${result.purchasedAt}`,
            success = true
      return { success, message, currencyPair: result } 
    } 
    catch (err) { throw err }
  }

  async closePosition({ id, soldAt, user }) {
    try {
      const pair = await Pair.findById(id)
      if(!pair) throw new Error('Pair not found')
      const pipDifFloat = (soldAt - pair.purchasedAt).toFixed(4)
      pair.soldAt = soldAt
      pair.pipDif = pipDifFloat 
      pair.profitLoss = pipDifFloat * pair.lotSize
      pair.open = false 
      const savedPair = await pair.save()
      user.bankroll += (pair.lotSize + savedPair.profitLoss)
      await user.save()

      const success = true,
            message = `${user.name} you've sold ${savedPair.pair} for a profit/loss of ${savedPair.profitLoss}.`
      return { success, message, currencyPair: savedPair }
    } 
    catch (err) { console.log(err) }
  }
}

module.exports = UserAPI

