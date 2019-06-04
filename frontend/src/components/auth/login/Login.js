import React from 'react'
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag' 
import {withRouter} from 'react-router-dom'

import LoginForm from './LoginForm' 

const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            id
            token
            tokenExpiration
        }
    }
`

function Login (props) {
    return (
        <ApolloConsumer>
            {client => (
                <Mutation 
                    mutation={LOGIN_USER}
                    onCompleted={({ login }) => {
                        localStorage.setItem('token', login.token)
                        client.writeData({ data: { isLoggedIn: true } })
                        props.history.push('/')
                    }}>
                    {(login, {loading, error }) => {
                        if(loading) return <p>Loading...</p>
                        if(error) return <p>Error</p>
                        return <LoginForm login={login} />
                    } }
                </Mutation>
            )}
        </ApolloConsumer>
    )
}

export default withRouter(Login)