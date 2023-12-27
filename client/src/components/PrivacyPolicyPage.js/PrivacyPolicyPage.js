import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const PrivacyPolicyPage = () => {
    const [policyContent, setPolicyContent] = useState('');

    const location = useLocation();
    // objects sent from previous page
    const { page, verificationToken, username, privileges } = location.state || {};
    const navigate = useNavigate();

    // display content of the policy on the page
    useEffect(() => {
      const fetchPrivacyPolicy = async () => {
        try {
            // backend call to get privacy policy content
            const res = await fetch('/api/open/getprivacypolicy');
            const data = await res.json();
    
            if (res.ok) {
                // set the content
                setPolicyContent(data.content);
            } else {
                console.error('Error:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
      };
      fetchPrivacyPolicy();
    }, []);

    // function when back is clicked
    const onBackClick = () => {

        // navigate to the previous page
        if (page === 'admin') {
            navigate('/adminpage', { state : { verificationToken }});
        } else if (page === 'authenticated') {
            navigate('/authenticatedpage', { state : { verificationToken, username, privileges }});
        } else if (page === 'landing') {
            navigate('/');
        }
    }


    return (
        <div>
            <h1>Security and Privacy Policy</h1>
            <p>{policyContent}</p>
            <button onClick={onBackClick}>Back</button>
        </div>
    )
}

export default PrivacyPolicyPage;