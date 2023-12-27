import React, {useState} from 'react';
import './AuthenticatedPage.css';
import axios from 'axios';
import { useEffect } from 'react';
// import the same search functionalities used in th landing page
import ExpandSearchResultBtn from '../LandingPage/ExpandSearchResultBtn';
import SearchHeroBtn from '../LandingPage/SearchHeroBtn';
import { useLocation } from 'react-router-dom';
import LogoutBtn from './LogoutBtn';
import ChangePasswordBtn from './ChangePasswordBtn';
import CreateListBtn from './CreateListBtn';
import AddToListBtn from './AddToListBtn';
import DeleteHeroFromListBtn from './DeleteHeroFromListBtn';
import SetListPrivacyBtn from './SetListPrivacyBtn';
import DeleteListBtn from './DeleteListBtn';
import UserListsDisplay from './UserListsDisplay';
import UpdateListDescription from './UpdateListDescription';
import DisplayListsForReviews from './DisplayListsForReviews';
import DeactivateUsersBtn from '../AdminPage/DeactivateUsersBtn';
import DisplayAllListsBtn from '../AdminPage/DisplayAllListsBtn';
import EditPrivacyPolicy from '../AdminPage/EditPrivacyPolicy';
import PrivacyPolicyLink from '../LandingPage/PrivacyPolicyLink';
import AUPLink from '../LandingPage/AUPLink';
import EditAUP from '../AdminPage/EditAUP';
import EditDCMA from '../AdminPage/EditDCMA';
import DCMALink from '../LandingPage/DCMALink';
import NavigateToManageRequests from '../AdminPage/NavigateToManageRequests';

const AuthenticatedPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  // receive the token sent from LoginBtn.js
  const location = useLocation();
  const { verificationToken, username } = location.state || {};
  const [privileges, setPrivileges] = useState(false);

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  // dynamically call the get privileges backend function
  useEffect(() => {
    const fetchPrivileges = async () => {
      try {
        const res = await axios.post('/api/secure/getprivileges', {
          token: verificationToken,
        });
        // set privileges to new value if it is updated which revokes certain admin functionalities from this user
        setPrivileges(res.data.privileges);
      } catch (error) {
        console.error('Error fetching privileges:', error);
      }
    };

    fetchPrivileges();
  }, [verificationToken]);

  
    return (

      <div className='container'>

        <h3>Site Manager: {privileges ? 'Yes' : 'No'}</h3>
        <LogoutBtn></LogoutBtn>
        <h1 className='header'>Welcome {username} </h1>
        
        <div id='divvy'>
          <h2>Change Password:</h2>
          <ChangePasswordBtn verificationToken={verificationToken}></ChangePasswordBtn>
        </div>

        {/* Create List Interface */}
        <div id='divvy'>
          <h2>Create a List:</h2>
          <CreateListBtn username={username}></CreateListBtn>
        </div>

        {/* Update List Description Interface */}
        <div id='divvy'>
          <h2>Edit List Description:</h2>
          <UpdateListDescription username={username}></UpdateListDescription>
        </div>

        {/* Add Heroes to List Interface*/}
        <div id='divvy'>
          <h2>Add Heroes to List:</h2>
          <AddToListBtn username={username}></AddToListBtn>
        </div>

        {/* Remove Heroes From List Interface */}
        <div id='divvy'>
          <h2>Delete Heroes from List:</h2>
          <DeleteHeroFromListBtn username = {username}></DeleteHeroFromListBtn>
        </div>

        {/* Set Privacy of List Interface */}
        <div id='divvy'>
          <h2>Set List Privacy:</h2>
          <SetListPrivacyBtn username={username}></SetListPrivacyBtn>
        </div>

        {/* Delete List Interface */}
        <div id='divvy'>
          <h2>Delete a List:</h2>
          <DeleteListBtn username = {username}></DeleteListBtn>
        </div>

        {/* Display Lists Interface*/}
        <div id='divvy'>
          <UserListsDisplay username={username}></UserListsDisplay>
          
        </div>

        {/* Display Lists to leave reviews on */}
        <div id='divvy'>
          <h2>Write a Review for a List:</h2>
          <DisplayListsForReviews username={username}></DisplayListsForReviews>
        </div>

        {/* Functionality to mark reviews as hidden/unhidden is only shown if the user has admin privileges */}
        {privileges && (
          <div className='inner-container'>
            <h2>Mark Reviews as Hidden/Unhidden:</h2>
            <DisplayAllListsBtn verificationToken={verificationToken}></DisplayAllListsBtn>
          </div>
        )}

        {/* Functionality to enable/disable accounts is only shown if user has admin privileges */}
        {privileges && (
          <div className='inner-container'>
            <h2>Disable/Undisable User:</h2>
            <DeactivateUsersBtn verificationToken={verificationToken} username ={username}></DeactivateUsersBtn>
          </div>
        )}

        {/* Create/update security and privacy policy if user has admin privileges */}
        {privileges && (
          <div className='inner-container'>
            <h2>Create/Update Security and Privacy Policy</h2>
            <EditPrivacyPolicy verificationToken={verificationToken}></EditPrivacyPolicy>
          </div>
        )}

        {/* Create/update AUP if user has admin privileges */}
        {privileges && (
          <div className='inner-container'>
            <h2>Create/Update Accessible Use Policy (AUP)</h2>
            <EditAUP verificationToken={verificationToken}></EditAUP>
          </div>
        )}

        {/* Create/update DCMA policy if user has admin privileges */}
        {privileges && (
          <div className='inner-container'>
            <h2>Create/Update DCMA Policy</h2>
            <EditDCMA verificationToken={verificationToken}></EditDCMA>
          </div>
        )}
        
      
        {/* Search Interface */}
        <div id = 'divvy'>
          <h2>Search Superheroes</h2>
          <SearchHeroBtn onSearch={handleSearch} ></SearchHeroBtn>
        </div>

        <div>
          <h2>Search Results:</h2>
          <div>
            {searchResults.map(hero => (
              <ExpandSearchResultBtn key={hero.id} hero={hero}/>
            ))}
          </div>
        </div>
        

        <PrivacyPolicyLink page={'authenticated'} verificationToken ={verificationToken} username = {username}
        privileges= {privileges}></PrivacyPolicyLink>
        <AUPLink page={'authenticated'} verificationToken ={verificationToken} username = {username}
        privileges= {privileges}></AUPLink>
        <DCMALink page={'authenticated'} verificationToken ={verificationToken} username = {username}
        privileges= {privileges}></DCMALink>

        {privileges && (
          <div>
            <NavigateToManageRequests page={'authenticated'} verificationToken ={verificationToken} username = {username}
            privileges= {privileges}></NavigateToManageRequests>
          </div>
        )}

      </div>
    );
  };
  
  export default AuthenticatedPage;