import React from 'react'
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag' 
import {withRouter} from 'react-router-dom'

import SignupForm from './SignupForm' 

const CREATE_USER = gql`
    mutation CreateUser($email: String!, $password: String!, $name: String!) {
        createUser(email: $email, password: $password, name: $name) {
            id
        }
    }
`

function Login (props) {
    return (
        <ApolloConsumer>
            {client => (
                <Mutation 
                    mutation={CREATE_USER}
                    onCompleted={() => {
                        props.history.push('/login')
                    }}>
                    {(createUser, {loading, error }) => {
                        if(loading) return <p>Loading...</p>
                        if(error) return <p>Error</p>
                        return <SignupForm createUser={createUser} />
                    } }
                </Mutation>
            )}
        </ApolloConsumer>
    )
}

export default withRouter(Login)