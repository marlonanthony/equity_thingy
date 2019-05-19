import React, { Component, useState, useEffect, useCallback } from 'react'
import keys from './keys_dev'
import './App.css';

const App = () => {
  const [toCurrency, setToCurrency] = useState('USD') 
  const [equity, setEquity] = useState({}) 
  const [isLoading, setIsLoading] = useState(false) 

  // BANK
  const [currency, setCurrency] = useState('EUR') 
  const [bankRoll, setBankRoll] = useState(100000)

  const fromCurrencyCode = '1. From_Currency Code',
        fromCurrencyName = '2. From_Currency Name',
        toCurrencyCode = '3. To_Currency Code',
        toCurrencyName = '4. To_Currency Name', 
        exchangeRate = '5. Exchange Rate',
        lastRefreshed = '6. Last Refreshed',
        timeZone = '7. Time Zone',
        bidPrice = '8. Bid Price',
        askPrice = '9. Ask Price'
  console.log(equity)

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
  }, [])

  return (
    <div className="App">
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
        <button type='submit'>Submit</button>
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
      <h1>BankRoll {bankRoll +' '+ currency}</h1>
      <button onClick={(e) => {
        const newBankRoll = (bankRoll * equity[askPrice]).toFixed(4)
        setBankRoll(newBankRoll)
        setCurrency(toCurrency.toUpperCase()) 
        setToCurrency('') 
      }}>Buy at ask price</button>
    </div>
  )
}

// class App extends Component {
//   state = { 
//     equity: {}, 
//     fromCurrency: 'USD', 
//     toCurrency: 'JPY' 
//   }

//   componentDidMount() { 
//     this.fetchData() 
//   }

//   fetchData = async () => {
//     try {
//       const { fromCurrency, toCurrency } = this.state
//       const res = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${keys.alphaVantageAPIKey}`)
//       const data = await res.json()
//       const equity = data['Realtime Currency Exchange Rate']
//       this.setState({ equity })
//     }
//     catch(err) { console.log(err) }
//   }

//   fetchDataAgain = async (e) => {
//     e.preventDefault()
//     try {
//       const { fromCurrency, toCurrency } = this.state
//       const res = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${keys.alphaVantageAPIKey}`)
//       const data = await res.json()
//       const equity = data['Realtime Currency Exchange Rate']
//       this.setState({ equity })
//     }
//     catch(err) { 
//       console.log(err) 
//     }
//   }

//   onChangeHandler = e => { this.setState({ [e.target.name]: e.target.value }) }


//   render() {
//     return (
//       <div className="App">
//         <h1>Currency Exchange</h1>
//         <form onSubmit={this.fetchDataAgain}> 
//           <input 
//             placeholder='From' 
//             onChange={this.onChangeHandler} 
//             name='fromCurrency' 
//             value={this.state.fromCurrency} 
//           />
//           <input 
//             placeholder='To' 
//             onChange={this.onChangeHandler} 
//             name='toCurrency' 
//             value={this.state.toCurrency} 
//           />
//           <button type='submit'>Submit</button>
//         </form>
//         { Object.keys(this.state.equity).map(equity => (
//           equity.includes('Last Refreshed') 
//           ? (
//               <div key={equity[0]} className='data'>
//                 <p className='key'>{`${equity.slice(2)}:`}</p> 
//                 <p>{`${new Date(this.state.equity[equity]).toLocaleString()}`}</p>
//               </div>
//             ) 
//           : (
//               <div key={equity[0]} className='data'>
//                 <p className='key'>{`${equity.slice(2).replace(/_/g, ' ')}:`}</p> 
//                 <p>{`${this.state.equity[equity]}`}</p>
//               </div>
//             )
//         )) }
//       </div>
//     )
//   }
// }

export default App
