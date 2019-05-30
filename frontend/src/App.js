import React, { useState, useEffect } from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
// import jwt from 'jsonwebtoken'

// import keys from './keys_dev'
import Header from './components/Header'
import './App.css'

const IS_LOGGED_IN = gql`
    query IsUserLogginIn {
        isLoggedIn @client
        token @client
    }
`

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

const GET_USERS = gql`
  query GetUsers {
    isLoggedIn @client
    token @client
    users {
      id
      currencyPairs {
        id
        pair 
        lotSize
        pipDif
        profitLoss
        purchasedAt
        soldAt
        open
      }
    }
  }
`

const GET_USER = gql`
  query GetUser($userId: ID!) {
    user(id: $userId) {
      email
      id

    }
  }
`

const App = () => {
  const [currency, setCurrency] = useState('EUR'),
        [toCurrency, setToCurrency] = useState('USD'),
        [bidPrice, setBidPrice] = useState(0),
        [askPrice, setAskPrice] = useState(0)



  return (
    <React.Fragment>
      <Header />
      <Query query={CURRENCY_PAIR_INFO} variables={{ fc: currency, tc: toCurrency }}> 
        {({ data, loading, error }) => {
          if (loading) return <h1>Loading...</h1>
          if(error) return <h1>Error</h1>
          return  data && data.currencyPairInfo && (
            <main className='container'>
              <div className='App'>
                <div className='buy_sell'>
                  { setAskPrice(+data.currencyPairInfo.askPrice) }
                  <Mutation
                    mutation={BUY_PAIR}
                    variables={{ pair: `${currency}/${toCurrency}`, lotSize: 100000, purchasedAt: askPrice }}>
                    {(buyPair, { data, loading, error }) => {
                      if(loading) return <p>Loading</p>
                      if(error) return <p>Error</p>
                      if(data) console.log(data) 
                      return buyPair && <button onClick={buyPair}>Buy</button>
                    }}
                  </Mutation>
                  {/* <p>PipDif: <span>{pipDif}</span></p>
                  <p>Profit/Loss: <span>{(pL +' '+ currency)}</span></p>
                  <p>PurchasedAt: <span>{exchangeRatePurchasedAt}</span></p> */}
                  <button onClick={() => {
                    }}>Sell 
                  </button>
                </div>
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
    </React.Fragment>
    // <Query query={GET_USER} variables={{ userId: "5cec859f39478a08113a7e09" }}> 
    //   {({ data, loading, error }) => {
    //     if (loading) return <h1>Loading...</h1>
    //     if(error) return <h1>Error</h1>
    //     const decodedToken = data.token && jwt.verify(data.token, keys.secretOrKey)
    //     return (
    //       <div>
    //         {data.user && (
    //           <div>
    //             <h1>{data.user.id && data.user.id}</h1>
    //             <h1>{data.user.email && data.user.email}</h1>
    //           </div>
    //         )}
    //       </div>
    //     )
    //   }}</Query>
    //   </React.Fragment>



    // <Query query={IS_LOGGED_IN}>
    //   {({ data }) => (
    //   <main className='container'>
    //     <div className="App">
    //       {data && data.isLoggedIn && <section>
    //         <h1>Bank Roll <span>{(purchasedBankRoll + pL || bankRoll) +' EUR'}</span></h1>
    //         <div className='buy_sell'>
    //           <button onClick={(e) => {
    //             const newBankRoll = (bankRoll).toFixed(4) 
    //             const storedExchangeRate = (equity[exchangeRate])//.toFixed(4) 
    //             setBankRoll(newBankRoll)
    //             localStorage.setItem('exchangeRate', storedExchangeRate)
    //             localStorage.setItem('bankRoll', (bankRoll).toFixed(4))
    //           }}>Buy
    //           </button>
    //           <p>PipDif: <span>{pipDif}</span></p>
    //           <p>Profit/Loss: <span>{(pL +' '+ currency)}</span></p>
    //           <p>PurchasedAt: <span>{exchangeRatePurchasedAt}</span></p>
    //           <button onClick={() => {
    //             const pipDifference = (equity[exchangeRate] - exchangeRatePurchasedAt).toFixed(4)
    //             setPipDif(pipDifference)
    //             }}>Sell 
    //           </button>
              
    //         </div>
    //       </section>}
    //       <section className='exchange_details'>
    //         <h1>Currency Exchange</h1>
    //         <form onSubmit={(e) => {
    //           fetchData() 
    //           setPipDif((equity[exchangeRate] - exchangeRatePurchasedAt).toFixed(4))
    //           e.preventDefault() 
    //         }}> 
    //           <input 
    //             placeholder={currency} 
    //             name='currency' 
    //             value={currency} 
    //             // onChange={e => setCurrency(e.target.value)}
    //             readOnly
    //           />
    //           <input 
    //             placeholder='To' 
    //             // onChange={e => setToCurrency(e.target.value)}
    //             name='toCurrency' 
    //             value={toCurrency} 
    //             readOnly
    //           />
    //           <select 
    //             onChange={e => setToCurrency(e.target.value)}
    //             name='toCurrency'
    //             value={toCurrency}
    //           >
    //             <option>USD</option>
    //             <option>GBP</option>
    //           </select>
    //           <button type='submit'>Update</button>
    //         </form>
    //         { isLoading ? <h1>LOADING</h1> : (
    //           equity && Object.keys(equity).map(val => (
    //             val.includes('Last Refreshed') 
    //             ? (
    //                 <div key={val[0]} className='data'>
    //                   <p className='key'>{`${val.slice(2)}:`}</p> 
    //                   <p>{`${new Date(equity[val]).toLocaleString()}`}</p>
    //                 </div>
    //               ) 
    //             : (
    //                 <div key={val[0]} className='data'>
    //                   <p className='key'>{`${val.slice(2).replace(/_/g, ' ')}:`}</p> 
    //                   <p>{`${equity[val]}`}</p>
    //                 </div>
    //               )
    //           )) 
    //         )}
    //       </section>
    //     </div>
    //   </main>
      // )}
  //   </Query>
  //   </React.Fragment>
  )
}

export default App
