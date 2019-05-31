import React from 'react'
import { ApolloConsumer } from 'react-apollo'

export default function Logout() {
    return (
        <ApolloConsumer>
            {client => (
                <li onClick={() => {
                    client.writeData({ data: { isLoggedIn: false } })
                    localStorage.clear() 
                }}>
                    Logout
                </li>
            )}
        </ApolloConsumer>
    )
}
