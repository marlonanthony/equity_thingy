import gql from 'graphql-tag' 

export const typeDefs = gql`
    extend type Query {
        isLoggedIn: Boolean!
        token: String
        id: String
    }
`

export const resolvers = {
    
} 