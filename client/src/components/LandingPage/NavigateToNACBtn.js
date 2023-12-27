import React from 'react';
import { useNavigate } from 'react-router-dom';


// create the button for navigating to new account creation in LandingPage.js file
const NavigateToNACBtn = () => {
  const navigate = useNavigate();

  const handleCreateAccountClick = () => {
    // navigate to the NewAccountPage when the button is clicked
    navigate('/newaccountpage');
  };

  return (
    <button onClick={handleCreateAccountClick}>Create New Account</button>
  );
};

export default NavigateToNACBtn;