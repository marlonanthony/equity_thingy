import React from 'react'
import gql from 'graphql-tag' 
import { Query, Mutation } from 'react-apollo'

import './Pair.css'

const CURRENCY_PAIR_INFO = gql`
  query CurrencyPairInfo($fc: String!, $tc: String!) {
    isLoggedIn @client
    currencyPairInfo(tc: $tc, fc: $fc) {
      fromCurrency 
      fromCurrencyName
      toCurrency
      toCurrencyName
      exchangeRate
      lastRefreshed
      timeZone
      bidPrice
      askPrice
    }
  }
`

const SELL_PAIR = gql`
    mutation SellPair($id: ID!, $soldAt: Float!) {
        sellPair(id: $id, soldAt: $soldAt) {
            success
            message
            currencyPair {
                id
                purchasedAt
                soldAt
                pipDif
                profitLoss
                updatedAt
                open
            }
        }
    }
`

export default function Pair(props) {
    const { lotSize, pair, purchasedAt, id } = props.location.state.pair,
          currency = pair.split('/')[0],
          toCurrency = pair.split('/')[1],
          { bankroll } = props.location.state 
          
    return (
        <Query query={CURRENCY_PAIR_INFO} variables={{ fc: currency, tc: toCurrency }}>
            {({ data, loading, error, refetch }) => {
                if(loading) return <h1>Loading...</h1>
                if(error) return `Error ${error}`
                const { bidPrice, lastRefreshed } = data.currencyPairInfo,
                      pipDif = (bidPrice - purchasedAt).toFixed(4) 
                
                return data && (
                    <div>
                        <div className='pair_container'>
                            <p><span>Bankroll: </span>{bankroll}</p>
                            <Mutation
                                mutation={SELL_PAIR}
                                variables={{ id, soldAt: +bidPrice }}>
                                {(sellPair, { data, loading, error }) => {
                                    if(loading) return <h1>Loading...</h1>
                                    if(error) return `Error ${error}` 
                                    return (
                                        <div className='pair_sell_button'>
                                            <button onClick={sellPair}>Sell</button>
                                            <p>{ data && data.sellPair.success && 'Success: True' }</p>
                                            <p>{ data && data.sellPair.message && data.sellPair.message }</p>
                                            { data && data.sellPair.currencyPair && <p>Sold At: { data.sellPair.currencyPair.soldAt }</p> }
                                        </div>
                                    )
                                }}
                            </Mutation>
                        </div>
                        <div className='pair'>
                            <p><span>Lot size: </span>{ lotSize.toLocaleString() + '.00' }</p>
                            <p><span>Currency pair: </span>{ pair }</p>
                            <p><span>Purchased price: </span>{ purchasedAt }</p>
                        </div>
                        <div className='pair'>
                            <button onClick={() => refetch()}>Refresh</button>
                            <p><span>Last Refreshed: </span>{ new Date(lastRefreshed).toLocaleTimeString() }</p>
                            <p><span>Current bid price: </span>{ Number(bidPrice).toFixed(4) }</p>
                            <p><span>Current pip difference: </span>{ pipDif }</p>
                            <p><span>Potential profilt/loss: </span>{ Math.round(pipDif * lotSize) + '.00' }</p>
                        </div>
                    </div>
                )
            }} 
        </Query>
    )
}
