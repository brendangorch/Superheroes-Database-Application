import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserListsDisplay = ({ username }) => {
  const [userLists, setUserLists] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(false);

  // for expanding lists
  const [expandedListId, setExpandedListId] = useState(null);

  // function to expand list
  const toggleListExpansion = (listId) => {
    setExpandedListId((prevId) => (prevId === listId ? null : listId));
  };

  useEffect(() => {
    const fetchUserLists = async () => {
      try {
        // call the backend display user lists method
        const response = await axios.post('/api/secure/displayuserlists', { username });
        setUserLists(response.data.lists);
      } catch (error) {
        console.error('Error fetching user lists:', error);
      }
    };

    fetchUserLists();
  }, [username, updateTrigger]); // include updateTrigger in the dependency array

  // function to toggle updates in the displayed lists
  const toggleUpdateTrigger = () => {
    setUpdateTrigger((prev) => !prev);
  };

  const renderUserLists = () => {
    if (userLists.length === 0) {
      return (
        <div>
          <h2>Your lists:</h2>
          <div><button onClick={toggleUpdateTrigger}>Refresh Lists</button></div>
          <p>No lists created.</p>
        </div>
       
      );
    }

    return (
      <div>
        <h2>Your Lists:</h2>
        <div><button onClick={toggleUpdateTrigger}>Refresh Lists</button></div>
        {userLists.map((list) => (
          <div key={list._id} id='list-container'>
            <h2><b>List Name:</b> {list.list_name}</h2>
            <h3><b>Description:</b> {list.description ? list.description : 'None'}</h3>
            {/* Expand button to display more list details */}
            {expandedListId === list._id && (
              <div>
                <p><b>Number of Heroes:</b> {list.number_of_heroes}</p>
                <p><b>Privacy:</b> {list.public ? 'Public' : 'Private'}</p>
                <p><b>Last Modified:</b> {list.last_modified}</p>
                <p><b>Created By:</b> {list.created_by}</p>
                <h2>Reviews:</h2>
                <p>
                    {list.reviews.length > 0 ? list.reviews.map((review, index) => (
                        !review.hidden && (
                        <div id = 'hero-container' key={index}>
                            <p><b>Rating:</b> {review.rating}</p>
                            <p><b>Comment:</b> {review.comment || "No comment added."}</p>
                            <p><b>Review By:</b> {review.created_by}</p>
                            <p><b>Created On:</b> {review.date_created}</p>
                        </div>
                        )
                    )) : 'No reviews yet.'}
                </p>
                <p><b>Average Rating:</b> {list.average_rating ? list.average_rating : 'None'}</p>
                <p><b>Superheroes:</b> {list.superheroes.map(hero => `${hero.name || 'Unknown'} (ID: ${hero.id || 'Unknown'})`).join(', ')}</p>
              </div>
            )}
            <button onClick={() => toggleListExpansion(list._id)}>Expand List</button>
            
          </div>
          
        ))}
      </div>
    );
  };

  return <div>{renderUserLists()}</div>;
};

export default UserListsDisplay;
