import React, {useState, useEffect} from 'react'
import './Register.css'
import {Typography, Button, Avatar} from '@mui/material'
import {Link} from 'react-router-dom'
import {registerUser} from '../../Actions/userAction'
import {useDispatch, useSelector} from 'react-redux'
import {useAlert} from 'react-alert'

const Register = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState("");
    const {loading, error} = useSelector((state) => state.user);
    // handleImageChange
    const handleImageChange = (e) => {
        const file = e.target.files[0];
    
        const Reader = new FileReader();
    
        Reader.onload = () => {
          if(Reader.readyState===2){
            setAvatar(Reader.result);
          }
        };
    
        Reader.readAsDataURL(file);
      }

    const submitHandler = (e) => {
        e.preventDefault();
        if(name == "" || email == "" || password == "" || avatar == ""){
          alert.error("All the Fields including Image must be added");
          return;
        }else{
          dispatch(registerUser(name, email, password, avatar));
        }
    }

    useEffect(() => {
        if(error) {
            alert.error(error);
            dispatch({type: "clearErrors"})
        }
    }, [dispatch, alert, error]);
  return (
    <div className='register'>
        <form className="registerForm" onSubmit={submitHandler}>
        <Typography variant = "h3" style = {{ padding: "2vmax" }}>Social Media</Typography>
        <Avatar 
            src = {avatar} 
            alt = "user image"
            sx = {{ height: "10vmax", width: "10vmax" }}
        />
            <input 
                type="file" 
                accept = "image/*" 
                onChange={handleImageChange}
            />
            <input 
              placeholder='Name' 
              type = "text" 
              value = {name} 
              onChange = {(e) => setName(e.target.value)}
              className = "registerInputs" 
              required
            />
            <input 
              placeholder='Email' 
              type = "email" 
              value = {email} 
              onChange = {(e) => setEmail(e.target.value)}
              className = "registerInputs" 
              required
            />
            <input 
              placeholder='Password' 
              value = {password} 
              onChange = {(e) => setPassword(e.target.value)} 
              type = "password" 
              className = "registerInputs"
              required
            />


            <Button disabled = {loading} type = "submit">Sign Up</Button>
            <Link to = "/" style = {{ padding: "2vmax" }}>
                <Typography>Already Signed Up? click to LogIn</Typography>
            </Link>
        </form>
    </div>
  )
}

export default Register