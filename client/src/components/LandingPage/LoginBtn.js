import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// create the button for logging in on the LandingPage.js file
const LoginBtn = () => {
  const navigate = useNavigate();
  // inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // input sanitization for emails
  const handleEmailChange = (event) => {
    const value = event.target.value;
    // define regex for allowed characters in email
    const emailRegex = /^[a-zA-Z0-9.@]*$/;

    if (emailRegex.test(value)) {
      setEmail(value);
    }
  };

  // input sanitization for passwords
  const handlePasswordChange = (event) => {
    const value = event.target.value;
    // define regex for allowed characters in password
    const passwordRegex = /^[a-zA-Z0-9!]*$/;

    if (passwordRegex.test(value)) {
      setPassword(value);
    }
  };

  const login = async () => {

    // email regex to verify emails are in proper format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // make sure both fields are entered
    if (email && password) {
      // if email is in proper format
      if (emailRegex.test(email)) {
          
        try {
          const res = await axios.post('/api/open/login', {
            email: email,
            password: password,
          });

          // get the authentication token of the account
          var verificationToken = res.data.verificationToken;
          
          // if account does not exist
          if (res.data.message === 'An account with this email does not exist.') {
            alert(res.data.message);
          } 
          // if password is incorrect
          else if (res.data.message === 'Incorrect password.') {
            alert(res.data.message);
          }
          // if account is deactivated
          else if (res.data.message === ('Account is deactivated, please contact the site administrator.')) {
            alert(res.data.message);
          } 
          // if account is not verified
          else if (res.data.message === 'Account is not verified.') {
            alert(res.data.message);
            navigate('/verifyemailpage', { state: { verificationToken } });
          } 
          // if login is successful
          else if (res.data.message === 'Login successful.') {
            // get the username from the backend using the token
            const res2 = await axios.post('/api/secure/getusername',{
              token: verificationToken
            });
            const username = res2.data.username;

            // if the account is admin
            if (username === 'admin') {
              alert("Successfully logged in as admin.")
              // navigate to admin page and send the token
              navigate('/adminpage', { state : { verificationToken }});
            } else {
              // get the username from the backend using the token
              const res3 = await axios.post('/api/secure/getprivileges',{
                token: verificationToken
              });
              const privileges = res3.data.privileges;
              
              // navigate to authenticated page and send token, username, and privileges
              alert(`Successfully logged in as ${username}.`);
              navigate('/authenticatedpage', { state: { verificationToken, username, privileges } });
            }
            
          }
        
        } catch (error) {
          // handle errors
          console.error('Error occured: ', error);
        }
      } else {
        alert("Enter a valid email.")
      }

    } else {
      alert("Please enter email and password to login.");
    }

  }

  return (
    <div>
      <label>Email:</label>
      <input type="text" id="email" name="email" value={email} onChange={handleEmailChange}/>
      <label>Password:</label>
      <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange}/>   
      <button type='submit' onClick={login}>Login</button>
    </div>
  );
};

export default LoginBtn;