import React from 'react'
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag' 

import LoginForm from './LoginForm' 

const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
        }
    }
`

export default function Login () {
    return (
        <ApolloConsumer>
            {client => (
                <Mutation 
                    mutation={LOGIN_USER}
                    onCompleted={({ login }) => {
                        localStorage.setItem('token', login.token)
                        client.writeData({ data: { isLoggedIn: true } })
                    }}>
                    {(login, {loading, error }) => {
                        if(loading) return <p>Loading...</p>
                        if(error) return <p>Error: {error}</p>
                        return <LoginForm login={login} />
                    } }
                </Mutation>
            )}
        </ApolloConsumer>
    )
}