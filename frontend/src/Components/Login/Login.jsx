import React, {useState, useEffect} from 'react'
import './Login.css'
import {Typography, Button} from '@mui/material'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { loginUser } from '../../Actions/userAction'
import {useAlert} from 'react-alert'

const Login = () => {
  const {error} = useSelector((state) => state.user);
  const alert = useAlert();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const dispatch = useDispatch(); 
  const loginHandler = (e) => {
    e.preventDefault();
    dispatch(loginUser(email, password));
  }

  const loginWithTestAccountOne = (e) => {
    e.preventDefault();
    dispatch(loginUser("stevengomesfreelancer23@gmail.com", "12345678"));
  }

  useEffect(() => {
    if(error) {
      alert.error(error);
      dispatch({type: "clearErrors"});
    }
  }, [alert, error, dispatch]);
  return (
    <div className = "login">
        <form className = "loginForm" onSubmit={loginHandler}>
            <Typography variant = "h3" style = {{ padding: "2vmax" }}>Social Media</Typography>
            <input 
              placeholder='Email' 
              type = "email" 
              value = {email} 
              onChange = {(e) => setEmail(e.target.value)} 
              required
            />
            <input 
              placeholder='Password' 
              value = {password} 
              onChange = {(e) => setPassword(e.target.value)} 
              type = "password" 
              required
            />
            

            <Link to = "/forgot/password">
                <Typography variant = "h6" style = {{ padding: "1vmax" }}>Forgot Password?</Typography>
            </Link>


            <Button type = "submit">Login</Button>
            <Button onClick={loginWithTestAccountOne}>Login With Test Account 1</Button>
            <Link to = "/register">
                <Typography style = {{ padding: "1vmax" }}>Register/Create Account?</Typography>
            </Link>
        </form>
        
    </div>
  )
}

export default Login