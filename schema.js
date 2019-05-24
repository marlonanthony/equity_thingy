const { gql } = require('apollo-server') 

const typeDefs = gql`
    type User {
        id: ID!
        email: String!
        equities: [Equity]!
    }

    type Equity {
        id: ID!
        purchasedPrice: Float!
        soldPrice: Float
        lotSize: Int!
    }

    type Query {
        equities: [Equity]!
        equity(id: ID!): Equity
        users: [User] 
        user(id: ID!): User 
    }

    type Mutation {
        buyEquity(equityId: ID!): EquityUpdateResponse!
        sellEquity(equityId: ID!): EquityUpdateResponse!
        login(email: String, password: String): Auth!
        createUser(email: String, password: String): User 
    }

    type EquityUpdateResponse {
        success: Boolean!
        message: String
        equities: [Equity]
    }

    type Auth {
        userId: ID! 
        token: String!
        tokenExpiration: Int
    }
`

module.exports = typeDefs 