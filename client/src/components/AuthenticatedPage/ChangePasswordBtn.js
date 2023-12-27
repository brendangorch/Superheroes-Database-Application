import React from 'react';
import {useRef} from 'react';
import axios from 'axios';

// create the btn for changing password
const ChangePasswordBtn = ({ verificationToken }) => {
    // create refs for input elements
    const currentPasswordRef = useRef();
    const newPasswordRef = useRef();
    const newPasswordConfirmRef = useRef();
    const verToken = verificationToken;

    // prevent special characters from being entered
    const validateKeyPress = (event) => {
        const regex = /^[a-zA-Z0-9!]*$/;
        if (!regex.test(event.key)) {
            event.preventDefault();
        }
    };

    const onChangePasswordClick = async () => {
        // access values using the refs
        const currentPassword = currentPasswordRef.current.value;
        const newPassword = newPasswordRef.current.value;
        const newPasswordConfirm = newPasswordConfirmRef.current.value;

        // make sure all fields are filled in
        if (currentPassword && newPassword && newPasswordConfirm) {
            // make sure new passwords match
            if (newPassword === newPasswordConfirm) {
                try {
                   
                    // make a request to backend for updating password
                    const res = await axios.post('/api/secure/changepassword', {
                      verificationToken: verToken,
                      currentPassword: currentPassword,
                      newPassword: newPassword
                    });
                    
                    const data = res.data;
                    // alert with the data message
                    alert(data.message);
                    
                  } catch (error) {
                    // handle errors, if any
                    console.error('Error fetching data:', error);
                  }
            } else {
                alert("New passwords do not match.")
            }
            
        } else {
            alert("Please fill in all fields to change password.")
        } 

        

    };

    return (
        <div className='div'>
            <label>Enter Current Password:</label>
            <input type="password" ref={currentPasswordRef} onKeyDown={validateKeyPress}/>


            <label>Enter New Password:</label>
            <input type="password" ref={newPasswordRef} onKeyDown={validateKeyPress}/>

            <label>Confirm New Password:</label>
            <input type = "password" ref={newPasswordConfirmRef} onKeyDown={validateKeyPress}/>
            <button onClick={onChangePasswordClick}>Change</button>
        </div>
    );
};

export default ChangePasswordBtn;