import React from 'react';
import { useNavigate } from 'react-router-dom';

const DCMALink = ({page, verificationToken, username, privileges}) => {
  const navigate = useNavigate();

  const onLinkClick = () => {
    // navigate to the DCMA page, send objects which will be needed to return to previous page
    navigate('/dcmapage', { state: { page, verificationToken, username, privileges } })

  };

  return (
    <div>
      <button className="link-button" onClick={onLinkClick}>
        DCMA Notice and Takedown Policy
      </button>
    </div>
  );
};

export default DCMALink;