import React from 'react';
import { useNavigate } from 'react-router-dom';


// create the btn for logging out
const LogoutBtn = () => {
  const navigate = useNavigate();

  const onLogoutClick = () => {
    alert("Successfully logged out.")
    navigate('/');

  };

  return (
    <div className='div'>
      <button type = 'submit' onClick= {onLogoutClick}>Logout</button>
    </div>
  );
};

export default LogoutBtn;