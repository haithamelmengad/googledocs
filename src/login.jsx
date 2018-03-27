import React from 'react';
import { Route } from 'react-router-dom';
import Style from './styles.js';
import currentUser from './currentUser';
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import { withRouter } from 'react-router'

function md5(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'No username specified',
      password: 'No password specified',
    };
    this.handleRegisterClick = () => {
      const { history } = this.props;      
      history.push('/register');
    };
    this.handleUsernameChange = (event) => {
      this.setState({
        username: event.target.value,
      });
      console.log(this.state.username);
    };
    this.handlePasswordChange = (event) => {
      this.setState({
        password: event.target.value,
      });
    };
    this.handleLoginClick = () => {
      currentUser.token = `Bearer ${jsonwebtoken.sign({
        username: this.state.username,
        password: md5(this.state.password)
      }, process.env.JWT_SECRET)}`;
      this.login();
    }
  }
  login() {
    const { history } = this.props;
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: currentUser.token,
      },
    })
    .then(res => res.json())
    .then((res) => {
      if (res.loggedIn === true) {
        currentUser.user = res.user;
        window.localStorage.setItem('currentUser', JSON.stringify(currentUser));
        history.push(`/user/${res.user._id}`);
      } else {
        currentUser.user = null;
        alert('failed to login successfully');
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  componentDidMount() {
    const savedCurrentUser = window.localStorage.getItem('currentUser');
    if (savedCurrentUser) {
      Object.assign(currentUser, JSON.parse(savedCurrentUser));
      this.login();
    }
  }

  render() {
    return (
      <div style={Style.largeContainer}>
        <div>
          <div>
            <div style={Style.topButtonContainer}>
              <button
                className="btn btn-xs"
                style={Style.btn}
                onClick={() => this.handleRegisterClick()} // correct syntax??
              >Register</button>
            </div>
          </div>
        </div>

        <div id="login-form-container" style={Style.formContainer}>
          <div>
            <div className="clearfix" />
            <div>
              <div>
                <input
                  className="form-control"
                  aria-label="Large"
                  type="text"
                  name="username"
                  placeholder="Name"
                  style={Style.input}
                  onChange={this.handleUsernameChange}
                />
              </div>
              <div className="clearfix" />

              <div>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  style={Style.input}
                  onChange={this.handlePasswordChange}
                />
              </div>
              <div className="clearfix" />
            </div>
            <div style={Style.loginBtnContainer}>
              <button
                type="submit"
                className="btn btn-md btn-primary"
                style={Style.btn}
                onClick={() => this.handleLoginClick()}
              >Log In</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Login);
