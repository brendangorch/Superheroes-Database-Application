import React, { useRef } from 'react';
import axios from 'axios';

// create the btn for updating description of list
const UpdateListDescription = ({ username }) => {
  // create refs for inputs
  const listNameRef = useRef();
  const descriptionRef = useRef();

  // prevent special characters from being entered
  const validateKeyPress = (event) => {
    const regex = /^[\p{L}a-zA-Z0-9!() ]*$/;
    if (!regex.test(event.key)) {
        event.preventDefault();
    }
  };

  // function called when update is clicked
  const onUpdateClick = async () => {
    // get the values of the refs
    const listName = listNameRef.current.value;
    const description = descriptionRef.current.value;

    // make sure list name is entered (description can be empty)
    if (listName) {
      try {
          // call the backend function for editing description of a list
          const res = await axios.post('/api/secure/editlistdescription', {
            username: username,
            listName: listName,
            description: description
        });

        alert(res.data.message);
  
      } catch (error) {
          console.log("Error:", error)
      }
    } else {
      alert("Please enter a list name.");
    }

  };

  return (
    <div className='div'>
        <label>Enter list name:</label>
        <input ref={listNameRef} type='text' onKeyDown={validateKeyPress}></input>
        <label>Enter description:</label>
        <input className='description' ref={descriptionRef} type='text' onKeyDown={validateKeyPress}></input>
        <div> <button type='submit' onClick={onUpdateClick}>Delete</button></div>
        
    </div>
  );
};

export default UpdateListDescription;