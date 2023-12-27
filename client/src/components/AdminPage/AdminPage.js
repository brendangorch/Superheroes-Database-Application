import React, {useState} from 'react';
import './AdminPage.css';
import SearchHeroBtn from '../LandingPage/SearchHeroBtn';
import ExpandSearchResultBtn from '../LandingPage/ExpandSearchResultBtn';
import LogoutBtn from '../AuthenticatedPage/LogoutBtn';
import { useLocation } from 'react-router-dom';
import GrantSiteManagerBtn from './GrantSiteManagerBtn';
import DeactivateUsersBtn from './DeactivateUsersBtn';
import DisplayAllListsBtn from './DisplayAllListsBtn';
import CreateListBtn from '../AuthenticatedPage/CreateListBtn';
import UpdateListDescription from '../AuthenticatedPage/UpdateListDescription';
import AddToListBtn from '../AuthenticatedPage/AddToListBtn';
import DeleteHeroFromListBtn from '../AuthenticatedPage/DeleteHeroFromListBtn';
import SetListPrivacyBtn from '../AuthenticatedPage/SetListPrivacyBtn';
import DeleteListBtn from '../AuthenticatedPage/DeleteListBtn';
import UserListsDisplay from '../AuthenticatedPage/UserListsDisplay';
import DisplayListsForReviews from '../AuthenticatedPage/DisplayListsForReviews';
import ChangePasswordBtn from '../AuthenticatedPage/ChangePasswordBtn';
import EditPrivacyPolicy from './EditPrivacyPolicy';
import PrivacyPolicyLink from '../LandingPage/PrivacyPolicyLink';
import EditAUP from './EditAUP';
import AUPLink from '../LandingPage/AUPLink';
import EditDCMA from './EditDCMA';
import DCMALink from '../LandingPage/DCMALink';
import NavigateToManageRequests from './NavigateToManageRequests';

const AdminPage = () => {

  const location = useLocation();
  const { verificationToken } = location.state || {};

  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  return (
    <div className='container'>
      <h2>Logged in as main admin account</h2>

      <LogoutBtn></LogoutBtn>


      <h1 className='header'>Welcome Admin</h1>

      <div id='divvy'>
          <h2>Change Password:</h2>
          <ChangePasswordBtn verificationToken={verificationToken}></ChangePasswordBtn>
      </div>
      
      <div className='inner-container'>
        <h2>Grant Site Manager Privileges to an Account:</h2>
        <GrantSiteManagerBtn verificationToken = {verificationToken}></GrantSiteManagerBtn>
      </div>

      <div className='inner-container'>
        <h2>Mark Reviews as Hidden/Unhidden:</h2>
        <DisplayAllListsBtn verificationToken={verificationToken}></DisplayAllListsBtn>
      </div>

      <div className='inner-container'>
        <h2>Disable/Undisable User:</h2>
        <DeactivateUsersBtn verificationToken={verificationToken} username ='admin'></DeactivateUsersBtn>

      </div>

      {/* Create List Interface */}
        <div id='divvy'>
          <h2>Create a List:</h2>
          <CreateListBtn username={'admin'}></CreateListBtn>
        </div>

        {/* Update List Description Interface */}
        <div id='divvy'>
          <h2>Edit List Description:</h2>
          <UpdateListDescription username={'admin'}></UpdateListDescription>
        </div>

        {/* Add Heroes to List Interface*/}
        <div id='divvy'>
          <h2>Add Heroes to List:</h2>
          <AddToListBtn username={'admin'}></AddToListBtn>
        </div>

        {/* Remove Heroes From List Interface */}
        <div id='divvy'>
          <h2>Delete Heroes from List:</h2>
          <DeleteHeroFromListBtn username = {'admin'}></DeleteHeroFromListBtn>
        </div>

        {/* Set Privacy of List Interface */}
        <div id='divvy'>
          <h2>Set List Privacy:</h2>
          <SetListPrivacyBtn username={'admin'}></SetListPrivacyBtn>
        </div>

        {/* Delete List Interface */}
        <div id='divvy'>
          <h2>Delete a List:</h2>
          <DeleteListBtn username = {'admin'}></DeleteListBtn>
        </div>

        {/* Display Lists Interface*/}
        <div id='divvy'>
          <UserListsDisplay username={'admin'}></UserListsDisplay>
        </div>

         {/* Display Lists to leave reviews on */}
         <div id='divvy'>
          <h2>Write a Review for a List:</h2>
          <DisplayListsForReviews verificationToken={verificationToken} username={'admin'}></DisplayListsForReviews>
        </div>

        {/* Create/update security and privacy policy */}
        <div className='inner-container'>
          <h2>Create/Update Security and Privacy Policy</h2>
          <EditPrivacyPolicy verificationToken={verificationToken}></EditPrivacyPolicy>
        </div>
        
        {/* Create/update AUP */}
        <div className='inner-container'>
          <h2>Create/Update Accessible Use Policy (AUP)</h2>
          <EditAUP verificationToken={verificationToken}></EditAUP>
        </div>

        {/* Create/update DCMA policy */}
        <div className='inner-container'>
          <h2>Create/Update DCMA Policy</h2>
          <EditDCMA verificationToken={verificationToken}></EditDCMA>
        </div>

      {/* Search Interface */}
      <div className="form">
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
        

      <PrivacyPolicyLink page={'admin'} verificationToken ={verificationToken}></PrivacyPolicyLink>
      <AUPLink page={'admin'} verificationToken ={verificationToken}></AUPLink>
      <DCMALink page={'admin'} verificationToken ={verificationToken}></DCMALink>

      <NavigateToManageRequests page={'admin'} verificationToken={verificationToken}></NavigateToManageRequests>
      

      </div>
  );
};

export default AdminPage;