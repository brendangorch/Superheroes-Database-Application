import React from 'react';
import { useNavigate } from 'react-router-dom';

const AUPLink = ({page, verificationToken, username, privileges}) => {
  const navigate = useNavigate();

  const onLinkClick = () => {
    // navigate to the AUP page, send objects which will be needed to return to previous page
    navigate('/auppage', { state: { page, verificationToken, username, privileges } })

  };

  return (
    <div>
      <button className="link-button" onClick={onLinkClick}>
        Accessible Use Policy (AUP)
      </button>
    </div>
  );
};

export default AUPLink;