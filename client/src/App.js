import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import NewAccountPage from './components/NewAccountPage/NewAccountPage'
import AuthenticatedPage from './components/AuthenticatedPage/AuthenticatedPage'
import AdminPage from './components/AdminPage/AdminPage';
import VerifyEmailPage from './components/VerifyEmailPage/VerifyEmailPage'
import PrivacyPolicyPage from './components/PrivacyPolicyPage.js/PrivacyPolicyPage';
import AUPPage from './components/AUPPage/AUPPage';
import DCMAPage from './components/DCMAPage/DCMAPage';
import ManageRequestsPage from './components/ManageRequestsPage/ManageRequestsPage';

const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element = {<LandingPage />} />
      <Route path='/newaccountpage' element = {<NewAccountPage />} />
      <Route path='/authenticatedpage' element = {<AuthenticatedPage />} />
      <Route path='/adminpage' element = {<AdminPage />} /> 
      <Route path='/verifyemailpage' element = {<VerifyEmailPage/>} />
      <Route path='/privacypolicypage' element = {<PrivacyPolicyPage/>} />
      <Route path='/auppage' element = {<AUPPage/>} />
      <Route path='/dcmapage' element = {<DCMAPage/>} />
      <Route path='/managerequestspage' element = {<ManageRequestsPage/>} />
    </Routes>
    </>
  );
};

export default App;