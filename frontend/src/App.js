import React, { useState, useEffect } from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import axios from 'axios' 
// import jwt from 'jsonwebtoken'

import keys from './keys_dev'
import Header from './components/Header'
import './App.css'

const IS_LOGGED_IN = gql`
    query IsUserLogginIn {
        isLoggedIn @client
        token @client
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

// const GET_USERS = gql`
//   query GetUsers {
//     isLoggedIn @client
//     token @client
//     users {
//       id
//       currencyPairs {
//         id
//         pair 
//         lotSize
//         pipDif
//         profitLoss
//         purchasedAt
//         soldAt
//         open
//       }
//     }
//   }
// `

// const GET_USER = gql`
//   query GetUser($userId: ID!) {
//     user(id: $userId) {
//       email
//       id

//     }
//   }
// `

// goofy ass API with spaces in its keys work around
const exchangeRate = '5. Exchange Rate',
      bidPrice = '8. Bid Price',
      askPrice = '9. Ask Price'

const App = () => {
  const [currency, setCurrency] = useState('EUR'),
        [toCurrency, setToCurrency] = useState('USD'),
        [equity, setEquity] = useState({}), 
        [isLoading, setIsLoading] = useState(false), 
        [bankRoll, setBankRoll] = useState(100000),
        [pipDif, setPipDif] = useState(0)
  
  let exchangeRatePurchasedAt = JSON.parse(localStorage.getItem('exchangeRate')) || 0,
      purchasedBankRoll = JSON.parse(localStorage.getItem('bankRoll')),
      pL = Math.round(pipDif * 100000)

  async function fetchData () {
    try {
      setIsLoading(true) 
      const res = await axios.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${currency}&to_currency=${toCurrency}&apikey=${keys.alphaVantageAPIKey}`)
      const equityData = res.data['Realtime Currency Exchange Rate']
      setEquity(equityData) 
      setIsLoading(false) 
    }
    catch(err) { console.log(err) }
  }  

  useEffect(() => {
    fetchData() 
  }, [currency, toCurrency]) // Left toCurrency out of deps because I dont want to make http req onChange


  return (
    <React.Fragment>
    <Header />
    {/* <Query query={GET_USER} variables={{ userId: "5cec859f39478a08113a7e09" }}> 
      {({ data, loading, error }) => {
        if (loading) return <h1>Loading...</h1>
        if(error) return <h1>Error</h1>
        const decodedToken = data.token && jwt.verify(data.token, keys.secretOrKey)
        return (
          <div>
            {data.user && (
              <div>
                <h1>{data.user.id && data.user.id}</h1>
                <h1>{data.user.email && data.user.email}</h1>
              </div>
            )}
          </div>
        )
    */}
    <Query query={IS_LOGGED_IN}>
      {({ data }) => (
      <main className='container'>
        <div className="App">
          {data && data.isLoggedIn && <section>
            <h1>Bank Roll <span>{(purchasedBankRoll + pL || bankRoll) +' EUR'}</span></h1>
            <div className='buy_sell'>
              <button onClick={(e) => {
                const newBankRoll = (bankRoll).toFixed(4) 
                const storedExchangeRate = (equity[exchangeRate])//.toFixed(4) 
                setBankRoll(newBankRoll)
                localStorage.setItem('exchangeRate', storedExchangeRate)
                localStorage.setItem('bankRoll', (bankRoll).toFixed(4))
              }}>Buy
              </button>
              <p>PipDif: <span>{pipDif}</span></p>
              <p>Profit/Loss: <span>{(pL +' '+ currency)}</span></p>
              <p>PurchasedAt: <span>{exchangeRatePurchasedAt}</span></p>
              <button onClick={() => {
                const pipDifference = (equity[exchangeRate] - exchangeRatePurchasedAt).toFixed(4)
                setPipDif(pipDifference)
                }}>Sell 
              </button>
              
            </div>
          </section>}
          <section className='exchange_details'>
            <h1>Currency Exchange</h1>
            <form onSubmit={(e) => {
              fetchData() 
              setPipDif((equity[exchangeRate] - exchangeRatePurchasedAt).toFixed(4))
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
            { isLoading ? <h1>LOADING</h1> : (
              equity && Object.keys(equity).map(val => (
                val.includes('Last Refreshed') 
                ? (
                    <div key={val[0]} className='data'>
                      <p className='key'>{`${val.slice(2)}:`}</p> 
                      <p>{`${new Date(equity[val]).toLocaleString()}`}</p>
                    </div>
                  ) 
                : (
                    <div key={val[0]} className='data'>
                      <p className='key'>{`${val.slice(2).replace(/_/g, ' ')}:`}</p> 
                      <p>{`${equity[val]}`}</p>
                    </div>
                  )
              )) 
            )}
          </section>
        </div>
      </main>
      )}
    </Query>
    </React.Fragment>
  )
}

export default App
