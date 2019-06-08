import React from 'react'
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag' 
import {withRouter} from 'react-router-dom'

import LoginForm from './LoginForm' 
import { IS_LOGGED_IN } from '../../header/Header'

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
                    update={(cache, args) => {
                        const data = cache.readQuery({ query: IS_LOGGED_IN })
                        console.log(args)
                        data.isLoggedIn = true
                        data.id = args.id 
                        cache.writeQuery({ query: IS_LOGGED_IN, data })
                    }}
                    onCompleted={({ login }) => {
                        localStorage.setItem('token', login.token)
                        console.log(login)
                        client.writeData({ data: { isLoggedIn: true, token: login.token, id: login.id } })
                        props.history.push('/')
                    }}>
                    {(login, {loading, error }) => {
                        if(loading) return <p>Loading...</p>
                        if(error) return <p>Error: { error.message }</p>
                        return <LoginForm login={login} />
                    } }
                </Mutation>
            )}
        </ApolloConsumer>
    )
}

export default withRouter(Login)