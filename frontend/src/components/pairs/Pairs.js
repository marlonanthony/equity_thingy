import React from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import keys from '../../keys_dev'
import gql from 'graphql-tag'

import './Pairs.css'

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      email
      id
      currencyPairs {
          id
          pair
          lotSize
          purchasedAt
          createdAt
          open
      }
    }
  }
`

export default function Pairs() {
    const token = localStorage.getItem('token')
    const decodedToken = token && jwt.verify(token, keys.secretOrKey)
    return (
        <div>
            <Query query={GET_USER} variables={{ id: decodedToken && decodedToken.id}}> 
            {({ data, loading, error }) => {
                if (loading) return <h1>Loading...</h1>
                if(error) return <h1>Error</h1>
                console.log(data.user)
                return (
                <div className='my_currency_pairs_container'>
                    <h1>Currency Pairs</h1>
                    {data && data.user && (
                    <div className='my_currency_pairs_wrapper'>
                        { data.user.currencyPairs.map(cPair => ( cPair.open && 
                            <div key={cPair.id} className='my_currency_pairs'>
                                <Link to={{ pathname: '/pair', state: { pair: cPair } }}>
                                    <p><span style={{ color: 'var(--secondary-color)' }}>Currency Pair: </span>{cPair.pair && cPair.pair}</p>
                                    <p><span style={{ color: 'var(--secondary-color)' }}>Lot Size: </span>{cPair.lotSize && cPair.lotSize.toLocaleString() + '.00' }</p>
                                    <p><span style={{ color: 'var(--secondary-color)' }}>Purchased Price: </span>{cPair.purchasedAt && cPair.purchasedAt}</p>
                                    <p><span style={{ color: 'var(--secondary-color)' }}>Open: </span>{cPair.open ? 'true' : 'false'}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                    )}
                </div>
                )
            }}
            </Query>
        </div>
    )
}

