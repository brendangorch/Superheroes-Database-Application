import React from 'react';
import {useRef, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


// create the inputs and button for creating a new account
const CreateNewAccountBtn = () => {
    const navigate = useNavigate();

    // create refs for input elements
    const emailRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();

    // prevent special characters from being entered
    const validateKeyPressEmail = (event) => {
        const regex = /^[a-zA-Z0-9.@]*$/;
        if (!regex.test(event.key)) {
            event.preventDefault();
        }
    };

    // prevent special characters from being entered
    const validateKeyPressUsername = (event) => {
        const regex = /^[a-zA-Z0-9\s-]*$/;
        if (!regex.test(event.key)) {
        event.preventDefault();
        }
    };

    // prevent special characters from being entered
    const validateKeyPressPassword = (event) => {
        const regex = /^[a-zA-Z0-9!]*$/;
        if (!regex.test(event.key)) {
        event.preventDefault();
        }
    };


    // method for onClick of create button
    const createAccount = async () => {
        
        // access values using the refs
        const email = emailRef.current.value;
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        // email regex to verify emails are in proper format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // make sure all fields are filled
        if (email && username && password) {
            // validate the email format
            if (emailRegex.test(email)) {

                try {
                    // call the backend function to create new account
                    const res = await axios.post(`/api/open/createaccount`, {
                        email: email,
                        username: username,
                        password: password
                    });
                    
                    // if username is taken
                    if (res.data.message === 'Username already taken.') {
                        alert(res.data.message);
                    } 
                    // if email is taken
                    else if (res.data.message === 'Email already taken.') {
                        alert(res.data.message);
                    } 
                    // if the account is created successfully
                    else if (res.data.message === 'Account created successfully.') {
                        const { verificationToken } = res.data;
                        alert(res.data.message);
                        // navigate to verify email page and send verification token from backend response as well
                        navigate(`/verifyemailpage`, { state: { verificationToken } });

                    }
                    
                    
                  } catch (error) {
                    // handle errors
                    console.error('Error occured: ', error);
                  }

            } else {
                alert("Please enter a valid email");
            }
            
        } else {
            alert('Please fill in all fields.');
        }

    }

    return (
        <div>
            <label type>Email:</label>
            <input type="text" ref = {emailRef} onKeyDown={validateKeyPressEmail}/>
            <label>Username:</label>
            <input type="text" ref = {usernameRef} onKeyDown={validateKeyPressUsername}/>
            <label>Password:</label>
            <input type="password" ref = {passwordRef} onKeyDown={validateKeyPressPassword}/>
            <button onClick={createAccount} type='submit'>Create</button>
        </div>
    );
};
  
export default CreateNewAccountBtn;