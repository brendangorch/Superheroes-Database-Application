import React from 'react';
import {useRef} from 'react';
import axios from 'axios';


// create the button for searching for heroes in the LandingPage.js file
const SearchHeroBtn = ({ onSearch }) => {
  // create refs for input elements
  const nameRef = useRef();
  const raceRef = useRef();
  const powerRef = useRef();
  const publisherRef = useRef();

  // prevent special characters from being entered
  const validateKeyPress = (event) => {
    const regex = /^[a-zA-Z0-9\s- ]*$/;
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  };

  // search method for onClick of search button
  const searchHero = async () => {
    // access values using the refs
    const name = nameRef.current.value;
    const race = raceRef.current.value;
    const power = powerRef.current.value;
    const publisher = publisherRef.current.value;


    // perform the search and update the state
    // DO ALL BACKEND STUFF IN THIS TRY CATCH
    try {
      // make an HTTP GET request tp the search by name back-end function
      const res = await axios.post(`/api/open/search/${name}`, {
        race: race,
        publisher: publisher,
        power: power
      });
      const data = res.data;
      
      const searchResults = performSearch(data);
      onSearch(searchResults);
    } catch (error) {
      // Handle errors, if any
      console.error('Error fetching data:', error);
    }

  };

  // performSearch returns data (matched heroes) to search result div in the LandingPage
  const performSearch = (data) => {
    return data;
  };

  return(
    <div>
      <label>Name:</label>
      <input type="text" id="name" name="name" onKeyDown={validateKeyPress} ref={nameRef}/>

      <label>Race:</label>
      <input type="text" id="race" name="race" onKeyDown={validateKeyPress} ref={raceRef}/>

      <label>Power:</label>
      <input type="text" id="power" name="power" onKeyDown={validateKeyPress} ref={powerRef}/>

      <label>Publisher:</label>
      <input type="text" id="publisher" name="publisher" onKeyDown={validateKeyPress} ref={publisherRef}/>
      <button onClick={searchHero}>Search</button>
    </div>
    
  );
};

export default SearchHeroBtn;