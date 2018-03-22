import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Login from './login';
import Register from './register';
import User from './user';
import Document from './document'

// import Style from './styles.js';


export default class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Route path={'/'} exact component={Register} />
          <Route path={'/login'} component={Login} />
          <Route path={'/user/:userId'} component={User} />
          <Route path={'/document/:docId'} component={Document} />
        </div>
      </Router>);
  }
}
