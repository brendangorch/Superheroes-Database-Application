import React from 'react';
import './VerifyEmailPage.css';
import ReturnToLoginBtn from './ReturnToLoginBtn';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmailPage = () => {
  // receive the verificationToken sent from CreateNewAccountBtn.js
  const location = useLocation();
  let { verificationToken } = location.state || {};
  const navigate = useNavigate()

  const onVerificationLinkClick = async () => {
    try {
    
        // make a request to backend for verification of email with the verificationToken
        const response = await axios.post(`/api/secure/verifyemail`, {
          verificationToken: verificationToken
        });
      
        // alert that email is verified
        alert(response.data.message);

        // navigate back to LandingPage for login
        navigate('/');


    } catch (error) {
        console.error('Error verifying email:', error);
    }

  }
  
  return (
    <div className='container'>

      <h1 className='header'>You must verify your email before logging in</h1>
      <h2>Please click on the link below to verify your email before clicking return to login. Clicking on this link will return you to the landing page to login.</h2>
      <h2>NOTE: If you do not verify your email, you will not be able to login!</h2>
      <div>
      <a href="#" onClick={onVerificationLinkClick}>
        Click here to verify your email address
      </a>
      </div>
      <ReturnToLoginBtn></ReturnToLoginBtn>
      

    </div>
  );
};


export default VerifyEmailPage;