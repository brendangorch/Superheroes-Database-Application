import React from 'react';
import { useNavigate } from 'react-router-dom';


// create the button for returning back to login
const ReturnToLoginBtn = () => {
  const navigate = useNavigate();

  const handleReturnClick = () => {
    // navigate to the Landing page when the button is clicked
    navigate('/');
  };

  return (
    <button onClick={handleReturnClick}>Return to Login</button>
  );
};

export default ReturnToLoginBtn;