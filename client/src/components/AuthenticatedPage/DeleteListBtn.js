import React, {useRef} from 'react';
import axios from 'axios';

// create the btn for creating a new list
const DeleteListBtn = ({username}) => {
    // create refs for input elements
    const listNameRef = useRef();

    // prevent special characters from being entered
    const validateKeyPress = (event) => {
      const regex = /^[\p{L}a-zA-Z0-9!() ]*$/;
      if (!regex.test(event.key)) {
          event.preventDefault();
      }
    };
    
  
    // function when btn is clicked
    const onDeleteClick = async () => {    
      // access value using the ref
      const listName = listNameRef.current.value;

      if (listName) {
        // confirmation for deletion
        const isConfirmed = window.confirm(`Are you sure you want to delete "${listName}"?`);
        if (isConfirmed) {
          try {
            // call backend delete list function
            var res = await axios.post('/api/secure/deletelist', {
              username: username,
              listName: listName
          });
  
          alert(res.data.message);
  
          } catch (error) {
              console.log("Error:",error)
          }
        } else {
          alert("Deletion cancelled.")
        }
        
      } else {
        alert("Please enter list to delete.")
      }

      
      

    };

    return (
        <div className='div'>
          <label>Enter list name:</label>
          <input ref={listNameRef} type='text' onKeyDown={validateKeyPress}></input>
          <button type='submit' onClick={onDeleteClick}>Delete</button>
        </div>
    );
};

export default DeleteListBtn;