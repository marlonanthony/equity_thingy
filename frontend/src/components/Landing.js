import React, { useState, Fragment } from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import jwt from 'jsonwebtoken'

import keys from '../keys_dev'
import { GET_USER } from './pairs/Pairs'

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

const Landing = props => {
    const [currency, setCurrency] = useState('EUR'),
          [toCurrency, setToCurrency] = useState('USD'),
          // [bidPrice, setBidPrice] = useState(0),
          [askPrice, setAskPrice] = useState(0),
          token = localStorage.getItem('token') || '',
          decodedToken = token && jwt.verify(token, keys.secretOrKey)

    return (
      <Query query={CURRENCY_PAIR_INFO} variables={{ fc: currency, tc: toCurrency }} errorPolicy='all'> 
        {({ data, loading, error, refetch }) => {
            if (loading) return <h1>Loading...</h1>
            if(error) return `Error ${error}`
            const isLoggedIn = data && data.isLoggedIn
            return  data && data.currencyPairInfo && (
            <main className='container'>
                <div className='App'>
                  <section className='exchange_details'>
                      <h1>Currency Exchange</h1>
                      <form onSubmit={(e) => {
                        e.preventDefault() 
                        // update cache here whenever currency or toCurrency is updated
                      }}> 
                      <div className='select-container'>
                        <p>From </p>
                        <select 
                          onChange={e => setCurrency(e.target.value) }
                          name='currency'
                          value={currency}
                        >
                          <option>EUR</option>
                          <option>USD</option>
                          <option>GBP</option>
                          <option>NZD</option>
                          <option>AUD</option>
                        </select>
                      </div>
                      <div className='select-container'>
                      <p>To </p>
                      <select 
                        onChange={e => setToCurrency(e.target.value) }
                        name='toCurrency'
                        value={toCurrency}
                      >
                        { currency === 'USD' 
                          ? (
                            <Fragment>
                              <option>JPY</option>
                              <option>CHF</option>
                              <option>CAD</option>
                            </Fragment>
                          ) : (
                            <option>USD</option>
                          )}
                      </select>
                      </div>
                      { setAskPrice(+data.currencyPairInfo.askPrice) }
                      <button onClick={() => refetch()}>Refresh</button>
                      { isLoggedIn && 
                      <Mutation
                        mutation={BUY_PAIR}
                        variables={{ pair: `${currency}/${toCurrency}`, lotSize: 100000, purchasedAt: askPrice }}
                        update={(cache , { data: { buyPair: { currencyPair } } }) => {
                          const { user } = cache.readQuery({ 
                            query: GET_USER,
                            variables: { id: decodedToken && decodedToken.id }
                          })
                          const data = user && user.currencyPairs.unshift(currencyPair)
                          cache.writeQuery({ query: GET_USER, data  })
                        }}
                        onCompleted={() => props.history.push('/pairs')}
                        >
                        {(buyPair, { data, loading, error }) => {
                          if(loading) return <p>Loading</p>
                          if(error) {
                            console.log(error)  
                            return <small style={{color: 'white'}}>Error: { error.message }</small>
                          }
                          return (buyPair && 
                            <>
                              <button onClick={buyPair}>Buy</button>
                              {/* <div>
                                <p>{data && data.buyPair.message}</p>
                              </div> */}
                            </>
                          )
                        }}
                      </Mutation> }
                      </form>
                      { data && data.currencyPairInfo && Object.keys(data.currencyPairInfo).map(val => (
                        val === '__typename' ? null :
                        val.includes('lastRefreshed') 
                          ? (
                            <div key={Math.random()} className='data'>
                              <p className='key'>{val && `${val}:`}</p> 
                              <p>{ data.currencyPairInfo[val] && `${new Date(data.currencyPairInfo[val]).toLocaleString()}`}</p>
                            </div>
                          ) 
                          : (
                            <div key={Math.random()} className='data'>
                              <p className='key'>{ val && `${val}:`}</p> 
                              <p>{ data.currencyPairInfo[val] && `${data.currencyPairInfo[val]}`}</p>
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
