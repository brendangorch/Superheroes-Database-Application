import React from 'react';
import { useNavigate } from 'react-router-dom';


// create the button for navigating to manage requests
const NavigateToManageRequests= ( {page, verificationToken, username, privileges} ) => {
  const navigate = useNavigate();

  const handleManageClick = () => {
    // navigate to the ManageRequestsPage when the button is clicked
    navigate('/managerequestspage', { state: { page, verificationToken, username, privileges } });
  };

  return (
    <button className='button' onClick={handleManageClick}>Manage Requests, Notices, and Disputes</button>
  );
};

export default NavigateToManageRequests;