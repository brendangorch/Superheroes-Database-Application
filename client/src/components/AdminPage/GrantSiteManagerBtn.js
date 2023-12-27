import axios from 'axios';
import React, { useRef } from 'react';

// create the btn for granting site manager to users as admin
const GrantSiteManagerBtn = ( {verificationToken} ) => {
    // create refs for inputs
    const usernameRef = useRef();

    // prevent special characters from being entered
    const validateKeyPress = (event) => {
        const regex = /^[a-zA-Z0-9\s\-_!]*$/;
        if (!regex.test(event.key)) {
            event.preventDefault();
        }
    };

    const onGrantClick = async () => {
        // get username
        const username = usernameRef.current.value;

        // make sure username input is filled and not main admin
        if (username && username !== 'admin') {
            try {
                // call the backend function to grant site manager to a user
                const res = await axios.post('/api/admin/grantsitemanager', {
                    adminToken: verificationToken,
                    username, username
                });

                alert(res.data.message);
            } catch (error) {
                console.log("Error:", error);
            }
        } else { 
            alert("Please enter a username (EXCLUDING ADMIN ACCOUNT).");
        }

    };

    const onRevokeClick = async () => {
        // get username
        const username = usernameRef.current.value;

        // make sure username input is filled and not main admin
        if (username && username !== 'admin') {
            try {
                // call the backend function to revoke site manager to a user
                const res = await axios.post('/api/admin/revokesitemanager', {
                    adminToken: verificationToken,
                    username, username
                });

                alert(res.data.message);
            } catch (error) {
                console.log("Error:", error);
            }
        } else { 
            alert("Please enter a username (EXCLUDING ADMIN ACCOUNT).");
        }
    }

    return (
        <div className='div'>
            <label>Enter username of user:</label>
            <input ref={usernameRef} type='text' onKeyDown={validateKeyPress}></input>
            <button className='button' type = 'submit' onClick= {onGrantClick}>Grant</button>
            <button className='button' type='submit' onClick= {onRevokeClick}>Revoke</button>
        </div>
    );
};

export default GrantSiteManagerBtn;