import axios from 'axios';
import React from 'react';
import { useRef } from 'react';

// create the btn for deactivating users as admin
const DeactivateUsersBtn = ( {verificationToken, username} ) => {
    // create ref for username
    const usernameRef = useRef();

    // prevent special characters from being entered
    const validateKeyPress = (event) => {
        const regex = /^[a-zA-Z0-9\s\-_!]*$/;
        if (!regex.test(event.key)) {
            event.preventDefault();
        }
    };

    // function for enable button clicked
    const onEnableClick = async () => {
        const selectedUsername = usernameRef.current.value;
        
        // make sure username input is filled (user cannot enable their own account or admin)
        if (selectedUsername && selectedUsername !== username && selectedUsername !== 'admin') {
            try {
                // call the backend function to enable a user
                const res = await axios.post('/api/admin/enableuser', {
                    adminToken: verificationToken,
                    username: selectedUsername
                });

                alert(res.data.message);
            } catch (error) {
                console.log("Error:", error);
            }
        } else { 
            alert("Please select a user to enable (EXCLUDING YOURSELF AND ADMIN).");
        }
    };

    // function for disable button clicked
    const onDisableClick = async () => {
        const selectedUsername = usernameRef.current.value;
        
        // make sure username input is filled (user cannot disable their own account or admin)
        if (selectedUsername && selectedUsername !== username && selectedUsername !== 'admin') {
            try {
                // call the backend function to disable a user
                const res = await axios.post('/api/admin/disableuser', {
                    adminToken: verificationToken,
                    username: selectedUsername
                });

                alert(res.data.message);
            } catch (error) {
                console.log("Error:", error);
            }
        } else { 
            alert("Please select a user to disable (EXCLUDING YOURSELF AND ADMIN).");
        }
    };

    return (
        <div className='div'>
            <label className='bolded-header'>Select User:</label>
            <input ref={usernameRef} type='text' onKeyDown={validateKeyPress}></input>
            <div>
                <button className='button' onClick={onEnableClick}>Enable</button>
            </div>
            <div>
                <button className='button' onClick={onDisableClick}>Disable</button>
            </div>
        </div>
    );
};

export default DeactivateUsersBtn;