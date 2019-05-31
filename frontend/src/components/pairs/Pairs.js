import React, { useState, Fragment } from 'react'
import { Query, Mutation, ApolloConsumer } from 'react-apollo'
import { Redirect, Route, Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import keys from '../../keys_dev'
import gql from 'graphql-tag'

import Pair from '../pair/Pair'
import './Pairs.css'

const GET_USER = gql`
  query GetUser($userId: ID!) {
    user(id: $userId) {
      email
      id
      currencyPairs {
          id
          pair
          lotSize
          purchasedAt
          createdAt
      }
    }
  }
`



export default function Pairs() {
    const token = localStorage.getItem('token')
    const decodedToken = token && jwt.verify(token, keys.secretOrKey)
    return (
        <div>
            <Query query={GET_USER} variables={{ userId: decodedToken && decodedToken.id}}> 
            {({ data, loading, error }) => {
                if (loading) return <h1>Loading...</h1>
                if(error) return <h1>Error</h1>
                
                return (
                <div className='my_currency_pairs_container'>
                    <h1>Currency Pairs</h1>
                    {data && data.user && (
                    <div className='my_currency_pairs_wrapper'>
                        { data.user.currencyPairs.map(cPair => (
                            <div key={cPair.id} className='my_currency_pairs'><Link to={{
                                pathname: '/pair',
                                state: { pair: cPair }
                            }}>
                                <p><span style={{ color: 'var(--secondary-color)' }}>Currency Pair: </span>{cPair.pair && cPair.pair}</p>
                                <p><span  style={{ color: 'var(--secondary-color)' }}>Lot Size: </span>{cPair.lotSize && cPair.lotSize}</p>
                                <p><span  style={{ color: 'var(--secondary-color)' }}>Purchased Price: </span>{cPair.purchasedAt && cPair.purchasedAt}</p>
                            </Link></div>
                        ))}
                    </div>
                    )}
                </div>
                )
            }}</Query>
        </div>
    )
}

