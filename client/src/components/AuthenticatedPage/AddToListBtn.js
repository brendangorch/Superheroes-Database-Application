import axios from 'axios';
import React, { useRef } from 'react';

// create the btn for creating a new list
const AddToListBtn = ({username}) => {
   // create refs for input elements
   const listNameRef = useRef();
   const heroIdRef = useRef();

    // prevent special characters from being entered
    const validateKeyPress = (event) => {
      const regex = /^[\p{L}a-zA-Z0-9\s\-_!/() ]*$/;
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
    const onAddClick = async () => {
      // access values using the refs
      const listName = listNameRef.current.value;
      const heroId = heroIdRef.current.value;    

      // make sure list name and hero id are entered
      if (listName && heroId) {
        try {
          // make a request to the add to list back-end function
          var res = await axios.post('/api/secure/addherotolist', {
            username: username,
            listName: listName,
            heroId: heroId
          });

          alert(res.data.message);

        } catch (error) {
            console.log("Error:", error);
        }

      } else {
          alert("Please fill in list name and hero id to add.")
      }
    };

    return (
        <div className='div'>
          <label>Enter list name:</label>
          <input ref={listNameRef} type='text' onKeyDown={validateKeyPress}></input>
          <label>Enter ID of hero to add:</label>
          <input ref={heroIdRef} type='number' min={0} onKeyDown={validateIdPress}></input>
          <button type='submit' onClick={onAddClick}>Add</button>
        </div>
    );
};

export default AddToListBtn;