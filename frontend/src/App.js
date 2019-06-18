import React, { Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'

import Header from './components/header/Header'
import Landing from './components/Landing'
import Pairs from './components/pairs/Pairs'
import Pair from './components/pair/Pair'
import ClosedPair from './components/pair/ClosedPair'
import Login from './components/auth/login/Login'
import Signup from './components/auth/signup/Signup'
import './App.css'



const App = () => {
  return (
    <Fragment>
      <Header />
      <Switch>
        <Route exact path='/' component={Landing} />
        <Route exact path='/pairs' render={() => <Pairs />} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/pair' component={Pair} />
        <Route exact path='/closedpair' component={ClosedPair} />
      </Switch>
    </Fragment>
  )
}

export default App
