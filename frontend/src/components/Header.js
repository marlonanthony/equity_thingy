import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

import Logout from './Logout'
import Login from './Login'

const IS_LOGGED_IN = gql`
    query IsUserLogginIn {
        isLoggedIn @client
        token @client
    }
`

export default class Header extends Component {
    render() {
        return (
            <div>
                <h1>Header</h1>
                <Query query={IS_LOGGED_IN}>
                    {({ data }) => { 
                        return data.isLoggedIn ? <Logout /> : <Login />
                    }} 
                </Query>
            </div>
        )
    }
}