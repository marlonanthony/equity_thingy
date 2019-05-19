import React, { Component, useState, useEffect, useCallback } from 'react'
import keys from './keys_dev'
import './App.css'

// goofy ass API with spaces in its keys work around
const fromCurrencyCode = '1. From_Currency Code',
      fromCurrencyName = '2. From_Currency Name',
      toCurrencyCode = '3. To_Currency Code',
      toCurrencyName = '4. To_Currency Name', 
      exchangeRate = '5. Exchange Rate',
      lastRefreshed = '6. Last Refreshed',
      timeZone = '7. Time Zone',
      bidPrice = '8. Bid Price',
      askPrice = '9. Ask Price'

const App = () => {
  const [currency, setCurrency] = useState('EUR') 
  const [toCurrency, setToCurrency] = useState('USD') 
  const [equity, setEquity] = useState({}) 
  const [isLoading, setIsLoading] = useState(false) 
  const [bankRoll, setBankRoll] = useState(100000)
  let profitLoss = 0

  async function fetchData () {
    try {
      setIsLoading(true) 
      const res = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${currency}&to_currency=${toCurrency}&apikey=${keys.alphaVantageAPIKey}`)
      const data = await res.json()
      const equityData = data['Realtime Currency Exchange Rate']
      setEquity(equityData) 
      setIsLoading(false) 
    }
    catch(err) { console.log(err) }
  }  

  useEffect(() => {
    fetchData() 
  }, [profitLoss, currency])

  return (
    // <main className='container'>
      <div className="App">
        <section >
          <h1>Bank Roll {bankRoll +' '+ currency}</h1>
          <div className='buy_sell'>
            <button onClick={(e) => {
              const newBankRoll = (bankRoll * equity[exchangeRate]).toFixed(4) 
              setBankRoll(newBankRoll)
              localStorage.setItem('exchangeRate', equity[exchangeRate])
              setCurrency(currency === 'USD' ? 'EUR' : 'USD') 
              setToCurrency(toCurrency === 'USD' ? 'EUR' : 'USD') 
            }}>Buy</button>
            <p>Profit/Loss: <span>{profitLoss +' '+ currency}</span></p>
            <button onClick={() => {
              const storedExchangeRate = JSON.parse(localStorage.getItem('exchangeRate'))
              profitLoss = equity[exchangeRate] - storedExchangeRate
              setCurrency(currency === 'USD' ? 'EUR' : 'USD') 
              setToCurrency(toCurrency === 'USD' ? 'EUR' : 'USD') 
            }}> Sell </button>
          </div>
        </section>
        <section className='exchange_details'>
          <h1>Currency Exchange</h1>
          <form onSubmit={(e) => {
            fetchData() 
            e.preventDefault() 
          }}> 
            <input 
              placeholder={currency} 
              name='currency' 
              value={currency} 
              readOnly
            />
            <input 
              placeholder='To' 
              onChange={e => setToCurrency(e.target.value)}
              name='toCurrency' 
              value={toCurrency} 
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
