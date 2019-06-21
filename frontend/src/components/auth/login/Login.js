import React from 'react'
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag' 
import {withRouter} from 'react-router-dom'

import LoginForm from './LoginForm' 
import { IS_LOGGED_IN } from '../../header/Header'
// import { GET_USER } from '../../pairs/Pairs'

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
    // let stuff
    return (
        <ApolloConsumer>
            {client => (
                <Mutation 
                    mutation={LOGIN_USER}
                    update={(cache, args) => {
                        // console.log(args.data.login.id)
                        // stuff = args
                        const data = cache.readQuery({ query: IS_LOGGED_IN })
                        // const {user} = cache.readQuery({ 
                        //     query: GET_USER,
                        //     variables: { id: args.data.login.id }
                        // })
                        // console.log(user)
                        data.isLoggedIn = true
                        data.id = args.data.login.id 
                        cache.writeQuery({ query: IS_LOGGED_IN, data })
                    }}
                    
                    onCompleted={({ login }) => {
                        localStorage.setItem('token', login.token)
                        client.writeData({ data: { isLoggedIn: true, token: login.token, id: login.id } })
                        props.history.push('/')
                        // console.log(stuff)
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