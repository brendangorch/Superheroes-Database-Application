import React, {useRef} from 'react';
import './AuthenticatedPage.css';
import axios from 'axios';

// create the btn for creating a new list
const SetListPrivacyBtn = ({username}) => {
    // create refs for input elements
    const listNameRef = useRef();

    // prevent special characters from being entered
    const validateKeyPress = (event) => {
      const regex = /^[\p{L}a-zA-Z0-9!() ]*$/;
      if (!regex.test(event.key)) {
          event.preventDefault();
      }
    };
  
    const onPrivateClick = async () => {   
      // get value of ref
      const listName = listNameRef.current.value;

      // ensure name is entered
      if (listName) {
        try {

          // call the backend function to switch list to private
          var res = await axios.post('/api/secure/setlisttoprivate', {
            username: username,
            listName: listName
          });

        alert(res.data.message);

        } catch (error) {
          console.log("Error:", error);
        }

      } else {
        alert("Please enter a list name.")
      }

    };

    const onPublicClick = async () => {
      // get value of ref
      const listName = listNameRef.current.value;

      // ensure name is entered
      if (listName) {
        try {
          // call the backend function to switch list to public
          var res = await axios.post('/api/secure/setlisttopublic', {
              username: username,
              listName: listName
          });

          alert(res.data.message);

        } catch (error) {
          console.log("Error:", error);
        }

      } else {
        alert("Please enter a list name.")
      }
    };

    return (
        <div className='div'>
          <label>Enter list name:</label>
          <input ref={listNameRef} type='text' onKeyDown={validateKeyPress}></input>
          <div className='div'>
            <button className='btn' type='submit' onClick={onPrivateClick}>Private</button>
          </div>
          <div className='div'>
            <button className='btn' type='submit' onClick={onPublicClick}>Public</button>
          </div>
        </div>
    );
};

export default SetListPrivacyBtn;