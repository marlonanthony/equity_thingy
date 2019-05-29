import gql from 'graphql-tag' 

export const typeDefs = gql`
    extend type Query {
        isLoggedIn: Boolean!
        token: String
    }
`

export const resolvers = {} 