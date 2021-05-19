import './App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";
import ChatList from "./pages/ChatList";
import Login from './pages/Login'
import { PrivateRoute, ProvideAuth } from './assets/context'

function App() {

  return (
    <ProvideAuth>
      <Router>
        <div style={{display: 'flex', flex: 1}}>
          <Switch>
            <PrivateRoute path="/chat">
              <ChatRoutes />
            </PrivateRoute>
            <Route path="/" component={Login} />
          </Switch>
        </div>
      </Router>
    </ProvideAuth>
  );
}

function ChatRoutes(){

  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={match.path}>
        <ChatList />
      </Route>
    </Switch>
  )

}

export default App;
