import React from 'react'
// import gql from 'graphql-tag' 
// import { Query } from 'react-apollo'

// const CURRENCY_PAIR_INFO = gql`
//   query CurrencyPairInfo($fc: String, $tc: String) {
//     isLoggedIn @client
//     currencyPairInfo(tc: $tc, fc: $fc) {
//       fromCurrency 
//       fromCurrencyName
//       toCurrency
//       toCurrencyName
//       exchangeRate
//       lastRefreshed
//       timeZone
//       bidPrice
//       askPrice
//     }
//   }
// `

export default function Pair(props) {
    console.log(props)
    const {id, createdAt, lotSize, pair, purchasedAt} = props.location.state.pair
    return (
        <div>
        {/* //     {({  })} */}
            <p>{id}</p>
            <p>{createdAt}</p>
            <p>{lotSize}</p>
            <p>{pair && pair}</p>
            <p>{purchasedAt}</p>
        </div>
    )
}
