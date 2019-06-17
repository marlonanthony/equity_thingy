import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import { withRouter } from 'react-router-dom'

function Logout(props) {
    return (
        <ApolloConsumer>
            {client => (
                <li onClick={() => {
                    client.writeData({ data: { isLoggedIn: false } })
                    props.history.push('/')
                    client.clearStore().catch(err => console.log(err)) 
                    localStorage.clear() 
                }}>
                    Logout
                </li>
            )}
        </ApolloConsumer>
    )
}

export default withRouter(Logout)
