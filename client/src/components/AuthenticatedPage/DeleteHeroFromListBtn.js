import React, { useRef } from 'react';
import axios from 'axios';

// create the btn for creating a new list
const DeleteHeroFromListBtn = ({username}) => {
    // create refs for input elements
    const listNameRef = useRef();
    const heroIdRef = useRef();

    // prevent special characters from being entered
    const validateKeyPress = (event) => {
        const regex = /^[\p{L}a-zA-Z0-9!() ]*$/;
        if (!regex.test(event.key)) {
            event.preventDefault();
        }
    };
  
    // prevent special characters from being entered
    const validateIdPress = (event) => {
        // allow numbers from 0 to 9 and the backspace key
        const regex = /^[0-9]$/;
        
        // allow the backspace key (keyCode 8)
        if (!regex.test(event.key) && event.keyCode !== 8) {
          event.preventDefault();
        }
    };
  
    // function when btn is clicked
    const onDeleteClick = async () => {    
        // get value of refs
        const listName = listNameRef.current.value;
        const heroId = heroIdRef.current.value;

        // make sure list name and hero id are entered
        if (listName && heroId) {
            try {
                // make a request to the delete from list back-end function
                var res = await axios.post('/api/secure/deleteherofromlist', {
                    username: username,
                    listName: listName,
                    heroId: heroId
                });
    
              alert(res.data.message);

            } catch (error) {
                console.log("Error:", error);
            }

        } else {
            alert("Please enter a list name and hero id to delete.");
        }

    };

    return (
        <div className='div'>
            <label>Enter list name:</label>
            <input ref={listNameRef} type='text' onKeyDown={validateKeyPress}></input>
            <label>Enter ID of hero to delete:</label>
            <input ref={heroIdRef} type='number' min={0} onKeyDown={validateIdPress}></input>
            <button type='submit' onClick={onDeleteClick}>Delete</button>
        </div>
    );
};

export default DeleteHeroFromListBtn;