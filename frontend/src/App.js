import React, { Component } from 'react'
import keys from './keys_dev'
import './App.css';

class App extends Component {
  state = { 
    equity: {}, 
    fromCurrency: 'USD', 
    toCurrency: 'JPY' 
  }

  componentDidMount() {
    this.fetchData() 
  }

  fetchData = async () => {
    try {
      const { fromCurrency, toCurrency } = this.state
      const res = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${keys.alphaVantageAPIKey}`)
      const data = await res.json()
      const equity = data['Realtime Currency Exchange Rate']
      this.setState({ equity })
    }
    catch(err) { console.log(err) }
  }
  fetchDataAgain = async (e) => {
    e.preventDefault()
    try {
      const { fromCurrency, toCurrency } = this.state
      const res = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${keys.alphaVantageAPIKey}`)
      const data = await res.json()
      const equity = data['Realtime Currency Exchange Rate']
      this.setState({ equity })
    }
    catch(err) { 
      console.log(err) 
    }
  }

  onChangeHandler = e => {
    this.setState({ [e.target.name]: e.target.value })
  }


  render() {
    return (
      <div className="App">
        <h1>Currency Exchange</h1>
        <form onSubmit={this.fetchDataAgain}> 
          <input 
            placeholder='From' 
            onChange={this.onChangeHandler} 
            name='fromCurrency' 
            value={this.state.fromCurrency} 
          />
          <input 
            placeholder='To' 
            onChange={this.onChangeHandler} 
            name='toCurrency' 
            value={this.state.toCurrency} 
          />
          <button type='submit'>Submit</button>
        </form>
        { Object.keys(this.state.equity).map(equity => (
          equity.includes('Last Refreshed') 
          ? (
              <div key={equity[0]} className='data'>
                <p className='key'>{`${equity.slice(2)}:`}</p> 
                <p>{`${new Date(this.state.equity[equity]).toLocaleString()}`}</p>
              </div>
            ) 
          : (
              <div key={equity[0]} className='data'>
                <p className='key'>{`${equity.slice(2).replace(/_/g, ' ')}:`}</p> 
                <p>{`${this.state.equity[equity]}`}</p>
              </div>
            )
        )) }
      </div>
    )
  }
}

export default App;
