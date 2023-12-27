import React, { useState } from 'react';
import DDGSearchBtn from './DDGSearchBtn';

// component for expanding search results of heroes
const ExpandSearchResultBtn = ({ hero }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // on click of the show details button, show the rest of the hero details
  return (
    <div key={hero.id} className='hero-item'>
      <p>Name: {hero.name}</p>
      <p>Publisher: {hero.Publisher}</p>
      <div className='btn-container'><DDGSearchBtn heroName = {hero.name} publisher = {hero.Publisher}/></div>
       
      <button onClick={toggleDetails}>Show Details</button>
      {showDetails && (
        <div> 
            <p>ID: {hero.id}</p>
            <p>Gender: {hero.Gender}</p>
            <p>Eye Color: {hero['Eye color']}</p>
            <p>Race: {hero.Race}</p>
            <p>Hair Color: {hero['Hair color']}</p>
            <p>Height: {hero.Height}</p>
            <p>Skin Color: {hero['Skin color']}</p>
            <p>Alignment: {hero.Alignment}</p>
            <p>Weight: {hero.Weight}</p>
            <p>Powers: {hero.Powers.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default ExpandSearchResultBtn;