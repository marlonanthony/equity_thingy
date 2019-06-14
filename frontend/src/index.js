import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory' 
import { HttpLink } from 'apollo-link-http'
import { ApolloProvider } from 'react-apollo'

import App from './App'
import { resolvers, typeDefs } from './resolvers'
import './index.css'

const cache = new InMemoryCache()

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

const data = {
    isLoggedIn: !!localStorage.getItem('token'),
    token: '',
    id: '',
    currencyPairInfo: {
        __typename: "DefaultPairDisplay",
    }
}

cache.writeData({ data })
client.onResetStore(() => cache.writeData({ data }))

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>, document.getElementById('root')
)