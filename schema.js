const { gql } = require('apollo-server') 

const typeDefs = gql`


    type User {
        id: ID!
        email: String!
        password: String
        bankroll: Float
        currencyPairs: [Pair]
    }

    type Pair {
        id: ID
        user: User
        pair: String
        lotSize: Int
        purchasedAt: Float
        soldAt: Float
        pipDif: Float
        profitLoss: Float
        createdAt: String
    }

    type PairUpdateResponse {
        success: Boolean!
        message: String
        currencyPair: Pair
    }

    type Auth {
        userId: ID! 
        token: String!
        tokenExpiration: Int
    }

    type Query {
        users: [User] 
        user(id: ID!): User 
        currencyPair(id: ID): Pair
        currencyPairs: [Pair]!
    }

    type Mutation {
        buyPair(pair: String, lotSize: Int, purchasedAt: Float, soldAt: Float, pipDif: Float): Pair!
        sellPair(id: ID!): PairUpdateResponse!
        login(email: String!, password: String!): Auth!
        createUser(email: String!, password: String!): User 
    }
`

module.exports = typeDefs 