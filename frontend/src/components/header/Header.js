import React from 'react'
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

const Header = () => {
  return (
    <div style={{marginBottom: 100}}>
      <Query query={IS_LOGGED_IN}>
      {({ data }) => { 
        return ( 
          <div className='header'>
            <header><NavLink exact to='/'>Currency Exchange</NavLink></header>
            <nav className='nav-items'>
              <ul>
                <li><NavLink exact to='/'>Home</NavLink></li>
                { data.isLoggedIn && <li><NavLink exact to='/pairs'>Currency Pairs</NavLink></li> }
                { data.isLoggedIn
                  ? <Logout />
                  : <li><NavLink exact to="/login">Login</NavLink></li>
                }
              </ul>
            </nav>
          </div>
        )
      }} 
      </Query>
    </div>
  )
}

export default Header