const { DataSource } = require('apollo-datasource')
const isEmail = require('isemail')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys_dev')

const User = require('../models/user') 

class UserAPI extends DataSource {
  constructor() {
    super()
  }

  // async willSendRequest(request) {
  //   request.headers.set('Authorization', this.context.token)
  // }

  initialize(config) {
    this.context = config.context
  }

  async createNewUser({ email, name, password }) {
    try {
      const existingUser = await User.findOne({ email })
      if(existingUser) { throw new Error('User exists already') }
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = await new User({
          name,
          email,
          password: hashedPassword
      })
      const res = await user.save()
      return { id: res._id, name, email }
    } catch (err) { throw err }
  }

  async loginUser({ email, password }) {
    try {
      const user = await User.findOne({ email })
      if(!user) { throw new Error('User does not exist!') }
      const isEqual = await bcrypt.compare(password, user.password)
      if(!isEqual) { throw new Error('Password is incorrect') }
      const token = await jwt.sign({ id: user.id, email, name: user.name }, keys.secretOrKey, {
          expiresIn: '1h' 
      })
      return { userId: user.id, token, tokenExpiration: 1 }
    } 
    catch (err) { throw err }
  }
}

module.exports = UserAPI

