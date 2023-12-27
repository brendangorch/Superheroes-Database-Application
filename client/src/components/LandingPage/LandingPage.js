import React, {useState} from 'react';
import './LandingPage.css';
import NavigateToNACBtn from './NavigateToNACBtn';
import SearchHeroBtn from './SearchHeroBtn';
import ExpandSearchResultBtn from './ExpandSearchResultBtn';
import LoginBtn from './LoginBtn';
import DisplayRecentLists from './DisplayRecentLists';
import PrivacyPolicyLink from './PrivacyPolicyLink';
import AUPLink from './AUPLink';
import DCMALink from './DCMALink';

const LandingPage = () => {

  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  return (
    <div className="container">
      <h1 className="header">Full-Stack Superhero Application</h1>
      <p className="intro">This full-stack application allows you to search from thousands of superheroes to find your favourites.
      You can also create custom lists of various superheroes. The back-end of this app was developed using REST, express, and MongoDB.
      The front-end was developed using React.</p>

      {/* Create New Account Form */}
      <div className = "login-container">
        <h2>Create New Account</h2>
        <NavigateToNACBtn></NavigateToNACBtn>
      </div>

      {/* Login Mechanism */}
      <div className="login-container">
        <h2>Login</h2>
        <LoginBtn></LoginBtn>
      </div>

      {/* Display 10 Most Recent Lists */ }
      <div className='form'>
        <h2>Display 10 Recent Lists:</h2>
        <DisplayRecentLists></DisplayRecentLists>
      </div>

      {/* Search Interface */}
      <div className="form">
        <h2>Search Superheroes</h2>
          <SearchHeroBtn onSearch={handleSearch} ></SearchHeroBtn>
      </div>

      <div>
        <h2>Search Results:</h2>
        {searchResults.length === 0 ? (
          <div className='login-container'><p>No results found</p> </div>
          
        ) : (
          <div>
            {searchResults.map((hero) => (
              <ExpandSearchResultBtn key={hero.id} hero={hero} />
            ))}
          </div>
        )}
      </div>

        
      <PrivacyPolicyLink page = {'landing'} ></PrivacyPolicyLink>
      <AUPLink page = {'landing'}></AUPLink>
      <DCMALink page = {'landing'}></DCMALink>
      
    </div>
  );
};

export default LandingPage;