import React from 'react'
import gql from 'graphql-tag' 
import { Query, Mutation } from 'react-apollo'

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
          toCurrency = pair.split('/')[1]
          
    return (
        <Query query={CURRENCY_PAIR_INFO} variables={{ fc: currency, tc: toCurrency }}>
            {({ data, loading, error }) => {
                if(loading) return <h1>Loading...</h1>
                if(error) return <h1>Error</h1>
                const { bidPrice, lastRefreshed } = data.currencyPairInfo,
                      pipDif = (bidPrice - purchasedAt).toFixed(4) 
                
                return (
                    <div style={{ textAlign: 'center' }}>
                        <p>Lot size: { lotSize.toLocaleString() + '.00' }</p>
                        <p>Currency pair: { pair }</p>
                        <p>Purchased price: { purchasedAt }</p>
                        <br />
                        <p>Last Refreshed: { new Date(lastRefreshed).toLocaleTimeString() }</p>
                        <p>Current bid price: { Number(bidPrice).toFixed(4) }</p>
                        <p>Current pip difference: { pipDif }</p>
                        <p>Potential profilt/loss: { Math.round(pipDif * lotSize) + '.00' }</p>
                        <Mutation
                            mutation={SELL_PAIR}
                            variables={{ id, soldAt: +bidPrice }}>
                            {(sellPair, { data, loading, error }) => {
                                if(loading) return <h1>Loading...</h1>
                                if(error) console.log(error) 
                                return (
                                    <div>
                                        <button onClick={sellPair}>Sell</button>
                                        <p>{ data && data.sellPair.success && 'Success: True' }</p>
                                        <p>{ data && data.sellPair.message && data.sellPair.message }</p>
                                        { data && data.sellPair.currencyPair && <p>Sold At: { data.sellPair.currencyPair.soldAt }</p> }
                                    </div>
                                )
                            }}
                        </Mutation>
                    </div>
                )
            }} 
        </Query>
    )
}
