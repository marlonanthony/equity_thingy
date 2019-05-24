// const { DataSource } = require('apollo-datasource')
// const isEmail = require('isemail')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken') 

// const User = require('../models/user') 

// class UserAPI extends DataSource {
//   constructor({ store }) {
//     super()
//     this.store = store
//   }

//   initialize(config) {
//     this.context = config.context
//   }

//   async createUser({ email: emailArg, password: passwordArg } = {}) {
//     const email = emailArg
//     if (!email || !isEmail.validate(email)) return null


//     const users = await this.store.users.findOrCreate({ where: { email } })
//     return users && users[0] ? users[0] : null
//   }
// }

// module.exports = UserAPI

