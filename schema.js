const { gql } = require('apollo-server') 

const typeDefs = gql`
    type Query {
        equities: [Equity]!
        equity(id: ID!): Equity
        me: User 
    }

    type Mutation {
        buyEquity(equityIds: [ID]!): EquityUpdateResponse!
        sellEquity(equityId: ID!): EquityUpdateResponse!
        login(email: String): String # return login token
    }

    type Equity {
        id: ID!
        open: Float!
        high: Float!
        low: Float!
        close: Float!
        volume: String!
        currentPrice: Float!
        purchasedPrice: Float!
        shares: Int!
        buy: Boolean!
        sell: Boolean!
    }

    type User {
        id: ID!
        email: String!
        trips: [Equity]!
    }

    type EquityUpdateResponse {
        success: Boolean!
        message: String
        equities: [Equity]
    }
`

module.exports = typeDefs