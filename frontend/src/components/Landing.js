import React, { useState, useEffect } from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'

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

const BUY_PAIR = gql`
  mutation BuyPair($pair: String!, $lotSize: Int!, $purchasedAt: Float!) {
    buyPair(pair: $pair, lotSize: $lotSize, purchasedAt: $purchasedAt){
      success
      message
      currencyPair {
        id
        pair
        lotSize
        purchasedAt
        open
        createdAt
      }
    }
  }
`

const Landing = () => {
    const [currency, setCurrency] = useState('EUR'),
          [toCurrency, setToCurrency] = useState('USD'),
          [bidPrice, setBidPrice] = useState(0),
          [askPrice, setAskPrice] = useState(0)

    return (
        <Query query={CURRENCY_PAIR_INFO} variables={{ fc: currency, tc: toCurrency }}> 
        {({ data, loading, error }) => {
            const isLoggedIn = data && data.isLoggedIn
            if (loading) return <h1>Loading...</h1>
            if(error) return <h1>Error</h1>
            return  data && data.currencyPairInfo && (
            <main className='container'>
                <div className='App'>
                { isLoggedIn && <div className='buy_sell'>
                    { setAskPrice(+data.currencyPairInfo.askPrice) }
                    <Mutation
                    mutation={BUY_PAIR}
                    variables={{ pair: `${currency}/${toCurrency}`, lotSize: 100000, purchasedAt: askPrice }}>
                    {(buyPair, { data, loading, error }) => {
                        if(loading) return <p>Loading</p>
                        if(error) return <p>Error</p>
                        return buyPair && <button onClick={buyPair}>Buy</button>
                    }}
                    </Mutation>
                    {/* <p>PipDif: <span>{pipDif}</span></p>
                    <p>Profit/Loss: <span>{(pL +' '+ currency)}</span></p>
                    <p>PurchasedAt: <span>{exchangeRatePurchasedAt}</span></p> */}
                    <button onClick={() => {
                    }}>Sell 
                    </button>
                </div>}
                <section className='exchange_details'>
                    <h1>Currency Exchange</h1>
                    <form onSubmit={(e) => {
                    e.preventDefault() 
                    }}> 
                    <input 
                        placeholder={currency} 
                        name='currency' 
                        value={currency} 
                        // onChange={e => setCurrency(e.target.value)}
                        readOnly
                    />
                    <input 
                        placeholder='To' 
                        // onChange={e => setToCurrency(e.target.value)}
                        name='toCurrency' 
                        value={toCurrency} 
                        readOnly
                    />
                    <select 
                        onChange={e => setToCurrency(e.target.value)}
                        name='toCurrency'
                        value={toCurrency}
                    >
                        <option>USD</option>
                        <option>GBP</option>
                    </select>
                    <button type='submit'>Update</button>
                    </form>

                    { data.currencyPairInfo && Object.keys(data.currencyPairInfo).map(val => (
                    val.includes('LastRefreshed') 
                        ? (
                            <div key={Math.random()} className='data'>
                            <p className='key'>{`${val}:`}</p> 
                            <p>{`${new Date(data.currencyPairInfo[val]).toLocaleString()}`}</p>
                            </div>
                        ) 
                        : (
                            <div key={Math.random()} className='data'>
                            <p className='key'>{`${val}:`}</p> 
                            <p>{`${data.currencyPairInfo[val]}`}</p>
                            </div>
                        )
                    ))}
                </section>
                </div>
            </main>
            )
        }}
        </Query>
    )
}

export default Landing
