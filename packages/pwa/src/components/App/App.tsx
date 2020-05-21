import React, { Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import styled from 'styled-components'

import GlobalStyle from 'components/GlobalStyle'
import Login from 'containers/Login'

const Main = styled('main')`
  height: 100%;
  display: flex;
`

const App = () => {
  return (
    <Fragment>
      <GlobalStyle />
      <Main>
        <Router>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/">
              <div>
                <h1>Home Page</h1>
                <Link to="login">login page</Link>
              </div>
            </Route>
          </Switch>
        </Router>
      </Main>
    </Fragment>
  )
}

export default App
