import React from 'react'
import { BrowserRouter, Route, Switch,  } from 'react-router-dom'

import Header from './components/Header'
import Landing from './components/Landing'
import Pairs from './components/pairs/Pairs'
import Pair from './components/pair/Pair'
import Login from './components/Login'
import './App.css'

const App = (props) => {
  
  return (
    <BrowserRouter>
      <Header />
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route exact path='/pairs' render={() => <Pairs />} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/pair' component={Pair} />
        </Switch>
    </BrowserRouter>
  )
}

export default App
