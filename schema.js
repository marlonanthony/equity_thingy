const { gql } = require('apollo-server') 

const typeDefs = gql`


    type User {
        id: ID!
        name: String!
        email: String!
        password: String
        bankroll: Float!
        currencyPairs: [Pair]
        createdAt: String
        updatedAt: String 
    }

    type Pair {
        id: ID!
        user: User!
        pair: String!
        lotSize: Int!
        purchasedAt: Float!
        open: Boolean!
        soldAt: Float
        pipDif: Float
        profitLoss: Float
        createdAt: String!
        updatedAt: String!
    }

    type DefaultPairDisplay {
        fromCurrency: String! 
        fromCurrencyName: String 
        toCurrency: String! 
        toCurrencyName: String 
        exchangeRate: String! 
        lastRefreshed: String
        timeZone: String 
        bidPrice: String 
        askPrice: String
    }

    type PairUpdateResponse {
        success: Boolean!
        message: String!
        currencyPair: Pair!
    }

    type Auth {
        userId: ID! 
        token: String!
        tokenExpiration: Int
    }

    type Query {
        users: [User!]! 
        user(id: ID!): User!
        currencyPair(id: ID!): Pair!
        currencyPairs: [Pair!]
        currencyPairInfo(fc: String, tc: String): DefaultPairDisplay!
    }

    type Mutation {
        buyPair(pair: String!, lotSize: Int, purchasedAt: Float!): PairUpdateResponse!
        sellPair(id: ID!, soldAt: Float!): PairUpdateResponse!
        login(email: String!, password: String!): Auth!
        createUser(email: String!, password: String!, name: String!): User 
    }
`

module.exports = typeDefs 