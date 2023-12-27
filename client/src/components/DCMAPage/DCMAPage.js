import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const DCMAPage = () => {
    const [policyContent, setPolicyContent] = useState('');

    const location = useLocation();
    // objects sent from previous page
    const { page, verificationToken, username, privileges } = location.state || {};
    const navigate = useNavigate();

    // display content of the DCMA on the page
    useEffect(() => {
      const fetchDCMA = async () => {
        try {
            // backend call to get dcma content
            const res = await fetch('/api/open/getdcma');
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
      fetchDCMA();
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
            <h1>DCMA Notice and Takedown Policy</h1>
            <p>{policyContent}</p>
            
            <button onClick={onBackClick}>Back</button>
            <h3>Send any notices of infringement to the site administrator via email: bgorchin@uwo.ca</h3>
        </div>
    )
}

export default DCMAPage;