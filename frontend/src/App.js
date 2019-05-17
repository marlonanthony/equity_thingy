import React, { Component } from 'react'
import keys from './keys_dev'
import './App.css';

class App extends Component {
  state = { equity: {} }

  componentDidMount() {
    fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=CAD&to_currency=JPY&apikey=${keys.alphaVantageAPIKey}`)
    .then(res => res.json()) 
    .then(res => {
      const equity = res['Realtime Currency Exchange Rate']
      this.setState({ equity })
    })
  }


  render() {
    return (
      <div className="App">
        { Object.keys(this.state.equity).map(equity => (
          <div key={equity[0]}>
            <p>{`${equity.slice(2)}: ${this.state.equity[equity]}`}</p>
          </div>
        )) }
        <p>{new Date(this.state.equity['6. Last Refreshed']).toLocaleString()}</p>
      </div>
    )
  }
}

export default App;
