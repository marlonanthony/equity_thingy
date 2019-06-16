import React from 'react'

import './ClosedPair.css'

export default function Pair(props) {
    const { lotSize, pair, purchasedAt, pipDif, profitLoss, soldAt } = props.location.state.pair,
          { bankroll } = props.location.state 
          
    return (
        <div className='closed-pair-container'>
            <p style={{textAlign: 'center'}}><span>Bankroll: </span>{ bankroll.toLocaleString() + '.00' }</p>
            <div className='closed_pair'>
                <p><span>Currency pair: </span>{ pair }</p>
                <p><span>Lot size: </span>{ lotSize.toLocaleString() + '.00' }</p>
                <p><span>Purchased price: </span>{ purchasedAt }</p>
                <p><span>Sold at: </span>{ soldAt }</p>
                <p><span>Current pip difference: </span>{ pipDif }</p>
                <p><span>Profit/Loss: </span>{ profitLoss }</p>
            </div>
        </div>
    )
}