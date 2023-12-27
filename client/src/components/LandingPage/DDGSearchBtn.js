import React from 'react';

// DDGSearchBtn component which searches the hero on DDG
const DDGSearchBtn = ({ heroName, publisher }) => {
  const handleSearchOnDDG = () => {
    const searchString = heroName + " " + publisher;
    const searchQuery = `https://duckduckgo.com/?q=${encodeURIComponent(searchString)}`;
    window.open(searchQuery, '_blank');
  };

  return (
    <button onClick={handleSearchOnDDG}>Search on DuckDuckGo</button>
  );
};

export default DDGSearchBtn;