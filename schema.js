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
        buyEquity(equityIds: [ID]!): EquityUpdateResponse!
        sellEquity(equityId: ID!): EquityUpdateResponse!
        login(email: String): String # return login token
    }

    type EquityUpdateResponse {
        success: Boolean!
        message: String
        equities: [Equity]
    }
`

module.exports = typeDefs 