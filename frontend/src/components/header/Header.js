import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { NavLink } from 'react-router-dom' 

import Logout from '../auth/Logout'
import './Header.css'

const IS_LOGGED_IN = gql`
    query IsUserLogginIn {
        isLoggedIn @client
        token @client
    }
`

export default class Header extends Component {
    render() {
        return (
            <div style={{marginBottom: 100}}>
                <Query query={IS_LOGGED_IN}>
                    {({ data }) => { 
                        console.log(data && data)
                        return ( 
                            <div className='header'>
                                <header>Navigation</header>
                                <nav className='nav-items'>
                                    <ul>
                                        { data.isLoggedIn
                                            ? <Logout />
                                            : <li><NavLink to="/login">Login</NavLink></li>
                                        }
                                        <li><NavLink to='/'>Home</NavLink></li>
                                        <li><NavLink to='/pairs'>Currency Pairs</NavLink></li>
                                        <li><NavLink to='/settings'>Settings</NavLink></li>
                                    </ul>
                                </nav>
                            </div>
                        )
                    }} 
                </Query>
            </div>
        )
    }
}