import React from 'react'
import gql from 'graphql-tag' 
import { Query } from 'react-apollo'

const CURRENCY_PAIR_INFO = gql`
  query CurrencyPairInfo($fc: String, $tc: String) {
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

export default function Pair(props) {
    const { lotSize, pair, purchasedAt } = props.location.state.pair,
          currency = pair.split('/')[0],
          toCurrency = pair.split('/')[1]
    return (
        <Query query={CURRENCY_PAIR_INFO} variables={{ fc: currency, tc: toCurrency }}>
            {({ data, loading, error }) => {
                if(loading) return <h1>Loading...</h1>
                if(error) return <h1>Error</h1>
                const {bidPrice, lastRefreshed } = data.currencyPairInfo,
                      pipDif = (bidPrice - purchasedAt).toFixed(4) 
                
                return (
                    <div style={{ textAlign: 'center' }}>
                        <p>Lot size: { lotSize }</p>
                        <p>Currency pair: { pair }</p>
                        <p>Purchased price: { purchasedAt }</p>
                        <br />
                        <p>Last Refreshed: { new Date(lastRefreshed).toLocaleTimeString() }</p>
                        <p>Current bid price: { Number(bidPrice).toFixed(4) }</p>
                        <p>Current pip difference: { pipDif }</p>
                        <p>Potential profilt/loss: { pipDif * lotSize }</p>
                    </div>
                )
            }} 
        </Query>
    )
}
