import React, { useState } from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import keys from '../../keys_dev'
import gql from 'graphql-tag'

import './Pairs.css'

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      email
      id
      bankroll
      currencyPairs {
          id
          pair
          lotSize
          purchasedAt
          soldAt
          pipDif
          profitLoss
          createdAt
          open
      }
    }
  }
`

export default function Pairs() {
    const token = localStorage.getItem('token') || '',
          decodedToken = jwt.verify(token, keys.secretOrKey) || '',
          [open, setOpen] = useState(true) 
    return (
        <div>
            <Query query={GET_USER} fetchPolicy='network-only' variables={{ id: token && decodedToken && decodedToken.id}}> 
            {({ data, loading, error }) => {
                if (loading) return <h1>Loading...</h1>
                if(error) return `Error ${error}`
                return (
                <div>
                    <h1>Currency Pairs</h1>
                    <div className='my_currency_pairs_container'>
                        { data && open 
                            ? (
                                <div className='openpositionwrapper'>
                                    <div className='positioninfo'>
                                        <p><span>Bankroll </span>{data && data.user && data.user.bankroll && data.user.bankroll.toLocaleString() + '.00'}</p>
                                        <div className='positioninfo'>
                                            <h4>Open positions</h4>
                                            <i className="far fa-folder-open" title='closed positions' onClick={() => setOpen(false)} />
                                        </div>
                                    </div>
                                    <div className='my_currency_pairs_wrapper'>
                                    { data.user.currencyPairs.map(cPair => ( cPair.open &&
                                        <div key={cPair.id} className='my_currency_pairs'>
                                            <Link to={{ pathname: '/pair', state: { pair: cPair, bankroll: data.user.bankroll } }}>
                                                <p><span>Currency Pair: </span>{cPair.pair && cPair.pair}</p>
                                                <p><span>Lot Size: </span>{cPair.lotSize && cPair.lotSize.toLocaleString() + '.00' }</p>
                                                <p><span>Purchased Price: </span>{cPair.purchasedAt && cPair.purchasedAt}</p>
                                                <p><span>Open: </span>{ cPair.open ? 'true' : 'false'}</p>
                                            </Link>
                                        </div> 
                                    ))}
                                    </div>
                                </div>
                            )
                            
                            : (
                                <div className='closedpositionwrapper'>
                                    <div className='positioninfo'>
                                        <p><span>Bankroll </span>{data && data.user && data.user.bankroll && data.user.bankroll.toLocaleString() + '.00'}</p>
                                        <div className='positioninfo'>
                                            <h4>Closed positions</h4>
                                            <i className="far fa-folder" title='open positions' onClick={() => setOpen(true)}/>
                                        </div>
                                    </div>
                                    <div className='my_currency_pairs_wrapper'>
                                        { data.user.currencyPairs.map(cPair => ( !cPair.open &&
                                            <div key={cPair.id} className='my_currency_pairs'>
                                                <Link to={{ pathname: '/closedpair', state: { pair: cPair, bankroll: data.user.bankroll } }}>
                                                    <p><span>Currency Pair: </span>{cPair.pair && cPair.pair}</p>
                                                    <p><span>Lot Size: </span>{cPair.lotSize && cPair.lotSize.toLocaleString() + '.00' }</p>
                                                    <p><span>Purchased Price: </span>{cPair.purchasedAt && cPair.purchasedAt}</p>
                                                    <p><span>Sold at: </span>{ cPair.soldAt && cPair.soldAt }</p>
                                                    <p><span>Pip Dif: </span>{cPair.pipDif && cPair.pipDif}</p>
                                                    <p><span>Profit/Loss: </span>{cPair.profitLoss && Math.round(cPair.profitLoss) + '.00'}</p>
                                                    <p><span>Open: </span>{cPair.open ? 'true' : 'false'}</p>
                                                </Link>
                                            </div> 
                                        ))}
                                    </div>
                                </div>
                            ) 
                        }



                    </div>
                </div>
                )
            }}
            </Query>
        </div>
    )
}

