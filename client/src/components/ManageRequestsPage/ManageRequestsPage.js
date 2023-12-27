import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CreateRequestForm from "./CreateRequestForm";

const ManageRequestsPage = () => {
    const location = useLocation();
    // objects sent from previous page
    const { page, verificationToken, username, privileges } = location.state || {};
    const navigate = useNavigate();


    // function when back is clicked
    const onBackClick = () => {
        // navigate to the previous page
        if (page === 'authenticated') {
            navigate('/authenticatedpage', { state : { verificationToken, username, privileges }});
        } else if (page === 'admin') {
            navigate('/adminpage', { state : { verificationToken}});
        }
    }


    return (
        <div className="container">
            <h1 className="header">Manage DCMA Requests, Notices, and Disputes</h1>
            <CreateRequestForm verificationToken={verificationToken}></CreateRequestForm>
            <button button className="button" onClick={onBackClick}>Back</button>

            <div> <a href="/DCMA_Guide.pdf" target="_blank">
            Open Guide</a></div>
            
            
        </div>
    )
}

export default ManageRequestsPage;