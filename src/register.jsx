import React from 'react';
import crypto from 'crypto';
import { Route } from 'react-router-dom';
import Style from './styles.js';

// Hash funciton to make passwords secure
function md5(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'No username specified',
      password: 'No password specified',
      confirmPassword: 'No password confirmation',
    };
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
          body: JSON.stringify({ username: this.state.username, password: md5(this.state.password), confirmPassword: md5(this.state.confirmPassword) }),
        })
      .then(res => res.json())
      .then((res) => {
        if (res.registered === true) {
          history.push('/');
        } else {
          alert(res.error); 
        }
      });
      }
    };

    this.handleLoginClick = (history) => {
    // console.log(`this is history : ${history}`);
      history.push('/');
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
