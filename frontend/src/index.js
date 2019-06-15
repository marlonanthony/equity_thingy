import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory' 
import { HttpLink } from 'apollo-link-http'
import { ApolloProvider } from 'react-apollo'
// import { onError } from "apollo-link-error"

import App from './App'
import { resolvers, typeDefs } from './resolvers'
import './index.css'

const cache = new InMemoryCache()

const data = {
    isLoggedIn: !!localStorage.getItem('token'),
    token: localStorage.getItem('token') || ''
}

cache.writeData({ data })


const link = new HttpLink({ 
    uri: 'http://localhost:4000/graphql',
    headers: {  
        authorization: localStorage.getItem('token') || ''
    } 
})
const client = new ApolloClient({ 
    cache,
    link,
    resolvers,
    typeDefs,
})
client.onResetStore(() => cache.writeData({ data }))


ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>, document.getElementById('root')
)