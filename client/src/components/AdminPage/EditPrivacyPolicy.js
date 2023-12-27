import axios from 'axios';
import React, { useState } from 'react';

const EditPrivacyPolicy = ( {verificationToken} ) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [policyContent, setPolicyContent] = useState('');

  const onCreateClick = async () => {
    try {
      // check if privacy policy is already created
      const res = await axios.get('/api/open/getprivacypolicy');
      if (res.data.content) {
        alert("Privacy policy already exists. You may update the current policy.")
      } else {
        // show text area and save button
        setIsCreating(!isCreating);
        setIsUpdating(false);
        setPolicyContent(''); // clear any existing content
      }

    } catch (error) {
        console.log("Error:",  error)
    }
  };

  const onUpdateClick = async () => {
    try {
      // check if privacy policy exists to be updated
      const res = await axios.get('/api/open/getprivacypolicy');
      if (!res.data.content) {
        alert("No privacy policy exists to be updated.")
      } else {
        // show text area and save button
        setIsUpdating(!isUpdating);
        setIsCreating(false);
        setPolicyContent(res.data.content); // set current policy content to the text area to be updated
      }
    } catch (error) {
        console.log("Error:",  error)
    }
    
  };

  const onSaveClick = async () => {

    // if creating is set to true 
    if (isCreating) {
      if (policyContent) {
        try {
          // call create policy backend function
          const res = await axios.post('/api/admin/createprivacypolicy', {
            adminToken: verificationToken,
            policyContent: policyContent
          });
  
          alert(res.data.message)
  
        } catch (error) {
          console.log("Error:",  error)
        }
      } else {
        alert("Please enter privacy content.")
      }

      // if updating is set to true
    } else if (isUpdating) {
      if (policyContent) {
        try {
          // call update policy backend function
          const res = await axios.post('/api/admin/updateprivacypolicy', {
            adminToken: verificationToken,
            policyContent: policyContent
          });
  
          alert(res.data.message)
  
        } catch (error) {
          console.log("Error:",  error)
        }
      } else {
        alert("Please enter privacy content.")
      }
     
    }

    // reset state after saving
    setIsCreating(false);
    setIsUpdating(false);
  };


  return (
    
      <div>
      <div>
      {!isUpdating && (
        
          <button className='button' onClick={onCreateClick}>
            Create
          </button>
        )}
        {!isCreating && (
          <button className='button' onClick={onUpdateClick}>
            Update
          </button>
        )}
      </div>

      {(isCreating || isUpdating) && (
        <div>
          <textarea
            id='text-area'
            value={policyContent}
            onChange={(e) => setPolicyContent(e.target.value)}
          />
          <div>
          <button className='button' onClick={onSaveClick}>
            Save
          </button>
          </div>
          
        </div>
      )}
    </div>
    

  
  );
};

export default EditPrivacyPolicy;