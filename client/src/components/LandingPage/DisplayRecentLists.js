import axios from 'axios';
import React, { useState } from 'react';

// create the btn for displaying recent lists
const DisplayRecentLists = () => {
    // required states for functionalities
    const [noListsMessage, setNoListsMessage] = useState('');
    const [recentLists, setRecentLists] = useState([]);
    const [isListVisible, setIsListVisible] = useState(false);
    const [expandedListId, setExpandedListId] = useState(null);
    const [expandedHeroId, setExpandedHeroId] = useState(null);

    // function to display recent lists
    const onDisplayClick = async () => {
        try {
            // call the backend function to get recent lists
            const res = await axios.get('/api/open/getrecentlists');
            const recentListsData = res.data.recentlyModifiedLists; 

            // update state with the recent lists
            setRecentLists(recentListsData);

            // Display message if no lists exist
            if (recentListsData.length === 0) {
                setNoListsMessage('No lists exist.');
            } else {
                setNoListsMessage('');
            }

            // toggle the visibility of the lists
            setIsListVisible((prevIsListVisible) => !prevIsListVisible);
        } catch (error) {
            console.log("Error:", error);
        }
    };

    // function to expand list
    const toggleExpandedList = (listId) => {
        setExpandedListId((prevId) => (prevId === listId ? null : listId));
    };

    // function to expand hero
    const toggleExpandedHero = (heroId) => {
        setExpandedHeroId((prevId) => (prevId === heroId ? null : heroId));
    };
    


    return (
        <div className="div">
        <button type="submit" onClick={onDisplayClick}>
          {isListVisible ? 'Hide Lists' : 'Display Lists'}
        </button>
  
        {/* Render the fetched recent lists or a message if no lists exist */}
        {isListVisible && recentLists.length > 0 ? (
          <div>
            <h2>Recent Lists:</h2>
            {recentLists.map((list) => (
              <div id="list-container" key={list._id}>
                <h3>List Name: {list.list_name}</h3>
                <h3>Created by: {list.created_by}</h3>
                <h3>Number of Heroes: {list.number_of_heroes}</h3>
                <h3>Average Rating: {list.average_rating || 'No ratings'}</h3>
                {/* Button to toggle expanded details */}
                <button onClick={() => toggleExpandedList(list._id)}>
                  {expandedListId === list._id ? 'Hide Details' : 'Show Details'}
                </button>
                {/* Expanded details */}
                {expandedListId === list._id && (
                  <div>
                    <h3>Description: {list.description || 'None'}</h3>
                    <h2>Heroes:</h2>
                    {list.superheroes.map((hero) => (
                      <div id='hero-container' key={hero.id}>
                        <h3>Name: {hero.name} (ID: {hero.id})</h3>
                        <h3>Publisher: {hero.Publisher}</h3>
                        <h3>Powers: {hero.Powers.join(', ')} </h3>
                        {/* Button to toggle expanded hero details */}
                        <button onClick={() => toggleExpandedHero(hero.id)}>
                          {expandedHeroId === hero.id ? 'Hide Hero Details' : 'Show Hero Details'}
                        </button>
                        {/* Expanded hero details */}
                        {expandedHeroId === hero.id && (
                          <div>
                          
                            <h3>Gender: {hero.Gender}</h3>
                            <h3>Eye Color: {hero['Eye color']}</h3>
                            <h3>Race: {hero.Race}</h3>
                            <h3>Hair Color: {hero['Hair color']}</h3>
                            <h3>Height: {hero.Height}</h3>
                            <h3>Skin Color: {hero['Skin color']}</h3>
                            <h3>Alignment: {hero.Alignment}</h3>
                            <h3>Weight: {hero.Weight}</h3>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>{noListsMessage}</p>
        )}
      </div>
    );
};

export default DisplayRecentLists;