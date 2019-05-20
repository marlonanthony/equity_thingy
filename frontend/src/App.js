import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios' 
import keys from './keys_dev'
import './App.css'

// goofy ass API with spaces in its keys work around
const exchangeRate = '5. Exchange Rate',
      // bidPrice = '8. Bid Price',
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
    // <main className='container'>
      <div className="App">
        <section >
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
        </section>
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
    // </main>
  )
}

export default App
