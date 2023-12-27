import axios from 'axios';
import React, { useState } from 'react';
import DisplayListReviewsBtn from './DisplayListReviewsBtn';

// create the btn for displaying all lists
const DisplayAllListsBtn = ( {verificationToken} ) => {
    const [allLists, setAllLists] = useState([]);
    const [noListsMessage, setNoListsMessage] = useState('');

    const onDisplayClick = async () => {
        try {
            // if lists exist
            if (allLists.length > 0) {
                setAllLists([]);
                setNoListsMessage('');
            } else {
                // call the backend function to display all lists
                const res = await axios.post('/api/admin/getalllists', {
                    adminToken: verificationToken,
                });

                const fetchedLists = res.data.lists;

                // display a message if no lists exist
                if (fetchedLists.length === 0) {
                    setNoListsMessage('No lists exist.');
                } else {
                    // update state with all lists
                    setAllLists(fetchedLists);
                    setNoListsMessage('');
                }
            }
        } catch (error) {
            console.log("Error:", error);
        }

    };

    return (
        <div className='div'>
        <button className='button' type='submit' onClick={onDisplayClick}>
          {allLists.length > 0 ? 'Hide Lists' : 'Display All Lists'}
        </button>
  
        {/* Render the fetched lists */}
        {allLists.length > 0 && (
          <div>
            <h2>All Lists:</h2>
              {allLists.map((list) => (
                <div id='list-container'>
                    <h3 key={list._id}>List Name: {list.list_name}</h3>
                    {list.description ? (
                    <h3>Description: {list.description}</h3>) : (<h3>None</h3>)}
                    <h3>Created By: {list.created_by}</h3>
                    <h3>Number of Heroes: {list.number_of_heroes}</h3>
                    <DisplayListReviewsBtn list={list} verificationToken={verificationToken}></DisplayListReviewsBtn>
                </div>
              ))}
          </div>
        )}
      </div>
    );
};

export default DisplayAllListsBtn;