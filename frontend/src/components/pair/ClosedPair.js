import React from 'react'
import './ClosedPair.css'

export default function Pair(props) {
    console.log(props.location.state.pair) 
    const { lotSize, pair, purchasedAt, pipDif, profitLoss, soldAt } = props.location.state.pair,
          currency = pair.split('/')[0],
          toCurrency = pair.split('/')[1]
          
    return (
        <div className='closed_pair'>
            <p><span>Lot size: </span>{ lotSize.toLocaleString() + '.00' }</p>
            <p><span>Currency pair: </span>{ pair }</p>
            <p><span>Purchased price: </span>{ purchasedAt }</p>
            <p><span>Sold at: </span>{ soldAt }</p>
            <p><span>Current pip difference: </span>{ pipDif }</p>
            <p><span>Profit/Loss: </span>{ profitLoss }</p>
        </div>
    )
}