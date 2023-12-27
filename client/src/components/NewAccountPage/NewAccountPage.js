import React from 'react';
import './NewAccountPage.css'; // Import the CSS file
import CreateNewAccountBtn from './CreateNewAccountBtn';

const NewAccountPage = () => {
  return (
    <div className="container">
      <h1 className="header">Create New Account</h1>
      
      {/* Create New Account Form */}
      <div className="form-container">


        <CreateNewAccountBtn></CreateNewAccountBtn>


      </div>
    </div>
  );
};

export default NewAccountPage;