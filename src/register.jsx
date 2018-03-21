import React from 'react';
// const fetchUrl = require('fetch').fetchUrl;
// import { Redirect } from 'react-router';
import { Route } from 'react-router-dom';
import Style from './styles.js';
// import Models from '../server/models/models.js';

// import Login from './login';


class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'No username specified',
      password: 'No password specified',            // MAKE PASSWORD SECURE
      confirmPassword: 'No password confirmation',
    };
    // I should probably put this outside the constructor- what are you talking about m8
    this.handleRegisterClick = (history) => {
      // check if the user was successfully registered
      if (!(this.state.password === this.state.confirmPassword)) {
        alert('Your passwords do not match!');                     // ADD A PASSWORDS DO NOT MATCH BAR
      } else {
        fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.state),
        })
      .then(res => res.json())
      .then((res) => {
        console.log('RESPONSE:', res);
        if (res.registered === true) {
          history.push('/login');
        } else {
          alert('failed to register successfully');
        }
      });
      }
    };

    this.handleLoginClick = (history) => {
    // console.log(`this is history : ${history}`);
      history.push('/login');
    };

    this.handleUsernameChange = (event) => {
      this.setState({
        username: event.target.value,
      });
    //   console.log('username ', this.state.username);
    };

    this.handlePasswordChange = (event) => {
      this.setState({
        password: event.target.value,
      });
    //   console.log('username ', this.state.username);
    };
    this.handleConfirmPasswordChange = (event) => {
      this.setState({
        confirmPassword: event.target.value,
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
                onClick={() => this.handleLoginClick(history)}
              >Log In</button>
            </div>
          </div>
        </div>

        <div id="form-container" style={Style.formContainer}>
          <div>
            <div className="clearfix" />
            <center>
              <center>
                <input
                  className="form-control"
                  aria-label="Large"
                  type="text"
                  name="username"
                  placeholder="Name"
                  style={Style.input}
                  onChange={this.handleUsernameChange}
                />
              </center>
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
              <div>
                <input
                  type="password"
                  className="form-control"
                  name="passwordRepeat"
                  placeholder="Confirm Password"
                  style={Style.input}
                  onChange={this.handleConfirmPasswordChange}
                />
              </div>
            </center>
            <div style={Style.loginBtnContainer}>
              <button
                type="submit"
                className="btn btn-md btn-primary"
                style={Style.btn}
                onClick={() => this.handleRegisterClick(history)}  // corect syntax??
              >Register</button>
            </div>
          </div>
        </div>
      </div>
    )}
    />);
  }
}

export default Register;
