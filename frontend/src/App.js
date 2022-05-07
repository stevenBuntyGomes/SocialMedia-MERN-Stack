import React, {useEffect} from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';
import Header from './Components/Header/Header'
import Login from './Components/Login/Login'
import {useDispatch, useSelector} from 'react-redux'
import { loadUser } from './Actions/userAction';
import Home from './Components/Home/Home'
import Account from './Components/Account/Account'
import NewPost from './Components/NewPost/NewPost'
import Register from './Components/Register/Register'
import UpdateProfile from './Components/UpdateProfile/UpdateProfile';
import UpdatePassword from './Components/UpdatePassword/UpdatePassword';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import UserProfile from './Components/UserProfile/UserProfile';
import Search from './Components/Search/Search'
import NotFound from './Components/NotFound/NotFound'

function App() {
  const {isAuthenticated} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  return (
    <Router>
      {isAuthenticated && <Header/>}
      {/* routes */}
      <Routes>
        <Route exact path = "/" element = {isAuthenticated && isAuthenticated ? <Home/> : <Login/>}/>
        <Route exact path = "/account" element = {isAuthenticated && isAuthenticated ? <Account/> : <Login/>}/>
        <Route exact path = "/register" element = {isAuthenticated && isAuthenticated ? <Account/> : <Register/>}/>
        <Route exact path = "/newpost" element = {isAuthenticated && isAuthenticated ? <NewPost/> : <Login/>}/>
        <Route exact path = "/update/profile" element = {isAuthenticated && isAuthenticated ? <UpdateProfile/> : <Login/>}/>
        <Route exact path = "/update/password" element = {isAuthenticated && isAuthenticated ? <UpdatePassword/> : <Login/>}/>
        <Route exact path = "/forgot/password" element = {isAuthenticated && isAuthenticated ? <UpdatePassword/> : <ForgotPassword/>}/>
        <Route exact path = "/password/reset/:token" element = {isAuthenticated && isAuthenticated ? <UpdatePassword/> : <ResetPassword/>}/>
        <Route exact path = "/user/:id" element = {isAuthenticated && isAuthenticated ? <UserProfile/> : <ResetPassword/>}/>
        <Route exact path = "/search" element = {isAuthenticated && isAuthenticated ? <Search/> : <Login/>}/>
        <Route path = "*" element = {isAuthenticated && isAuthenticated ? <NotFound/> : <NotFound/>}/>
      </Routes>
    </Router>
    
  );
}

export default App;
