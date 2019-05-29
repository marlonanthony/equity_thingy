import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory' 
import { HttpLink } from 'apollo-link-http'
import { ApolloProvider, Query } from 'react-apollo'
import gql from 'graphql-tag'
import jwt from 'jsonwebtoken' 

// import keys from './keys_dev'
import Login from './components/Login'
import App from './App'
import { resolvers, typeDefs } from './resolvers'
import * as serviceWorker from './serviceWorker'
import './index.css'

const IS_LOGGED_IN = gql`
    query IsUserLogginIn {
        isLoggedIn @client
        token @client
    }
`
const cache = new InMemoryCache() 

const link = new HttpLink({ 
    uri: 'http://localhost:4000/graphql',
    headers: { 
        authorization: localStorage.getItem('token'),
        userId: localStorage.getItem('userid') 
    } 
})
const client = new ApolloClient({ 
    cache,
    link,
    typeDefs,
    resolvers
})

cache.writeData({
    data: {
        isLoggedIn: !!localStorage.getItem('token'),
        token: localStorage.getItem('token') || ''
    }
})

// if(cache.data.data.ROOT_QUERY.token) {
//     console.log(jwt.verify(cache.data.data.ROOT_QUERY.token, 'key')) 
// }

ReactDOM.render(
    <ApolloProvider client={client}>
        <Query query={IS_LOGGED_IN}>
            {({ data }) => { 
                return data.isLoggedIn && data.isLoggedIn ? <App /> : <Login />
            }}
        </Query>
    </ApolloProvider>, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
