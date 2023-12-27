import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyLink = ({page, verificationToken, username, privileges}) => {
  const navigate = useNavigate();

  const onLinkClick = () => {
    // navigate to the policy page, send objects which will be needed to return to previous page
    navigate('/privacypolicypage', { state: { page, verificationToken, username, privileges } })

  };

  return (
    <div>
      <button className="link-button" onClick={onLinkClick}>
        Security and Privacy Policy
      </button>
    </div>
  );
};

export default PrivacyPolicyLink;