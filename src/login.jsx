import React from 'react';
import { Route } from 'react-router-dom';
import Style from './styles.js';
import currentUser from './currentUser';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'No username specified',
      password: 'No password specified',
    };
    this.handleRegisterClick = (history) => {
      history.push('/');
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
    this.handleLoginClick = (history) => {
      console.log('CLICKED LOGIN BUTTON');
      // console.log(this.state.username);
      // console.log(this.state.password);
      fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state),
      })
      .then(res => res.json())
      .then((res) => {
        if (res.loggedIn === true) {
          console.log('logged in success!!');
          console.log("Check user:", res.user)
          currentUser.user = res.user;
          history.push(`/user/${res.user.userId}`);
        } else {
          currentUser.user = null;
          alert('failed to login successfully');
        }
      })
      .catch((error) => {
        console.log(error);
      });
    };
  }

  render() {
    return (<Route render={({ history }) => (
      <div style={Style.largeContainer}>
        <div>
          <div>
            <div style={Style.topButtonContainer}>
              <button
                className="btn btn-xs"
                style={Style.btn}
                onClick={() => this.handleRegisterClick(history)} // correct syntax??
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
                onClick={() => this.handleLoginClick(history)}
              >Log In</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
    />);
  }
}


export default Login;
