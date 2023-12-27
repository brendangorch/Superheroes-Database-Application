import React, {useRef} from 'react';
import axios from 'axios';

// create the btn for creating a new list
const CreateListBtn = ({username}) => {
    // create refs for input elements
    const listNameRef = useRef();
    const descriptionRef = useRef();
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
    const onCreateClick = async () => { 
        // access values using the refs
        const listName = listNameRef.current.value;
        const description = descriptionRef.current.value;
        const heroId = heroIdRef.current.value;

        // make sure list name and hero id are entered
        if (listName && heroId) {
            try {

                if (description) {
                    // make a request to the create list back-end function
                    var res = await axios.post('/api/secure/createlist', {
                        username: username,
                        listName: listName,
                        description: description,
                        heroId: heroId
                    });
                } else {
                    // make a request to the create list back-end function
                    var res = await axios.post('/api/secure/createlist', {
                        username: username,
                        listName: listName,
                        heroId: heroId
                    });
                }
                
                alert(res.data.message);
    
            } catch (error) {
                console.log("Error:", error);
            }
        } else {
            alert("Please fill in list name and hero Id to add.")
        }
    };

    return (
        <div className='div'>
          <label>Enter list name:</label>
          <input ref={listNameRef} type='text' onKeyDown={validateKeyPress}></input>
          <label>Enter description (optional):</label>
          <input ref={descriptionRef} className='description' type='text' onKeyDown={validateKeyPress}></input>
          <label>Enter ID of first hero to add:</label>
          <input ref={heroIdRef} type='number' min={0} onKeyDown={validateIdPress}></input>
          <button type='submit' onClick={onCreateClick}>Create</button>
        </div>
    );
};

export default CreateListBtn;