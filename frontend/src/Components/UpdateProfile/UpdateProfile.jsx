import React, {useState, useEffect} from 'react'
import './UpdateProfile.css'
import {Typography, Button, Avatar} from '@mui/material'
import {Link} from 'react-router-dom'
import {loadUser, updateProfile} from '../../Actions/userAction'
import {useDispatch, useSelector} from 'react-redux'
import {useAlert} from 'react-alert'
import {useNavigate} from 'react-router-dom'
import Loader from '../Loader/Loader'

const UpdateProfile = () => {
    const history = useNavigate(); 
    const {loading, error, user, updateLoading, updateMessage, updateError} = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const alert = useAlert();
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPrev, setAvatarPrev] = useState(user.avatar.url);
    
    // handleImageChange
    const handleImageChange = (e) => {
        const file = e.target.files[0];
    
        const Reader = new FileReader();
    
        Reader.onload = () => {
          if(Reader.readyState===2){
            setAvatarPrev(Reader.result);
            setAvatar(Reader.result);
          }
        };
    
        Reader.readAsDataURL(file);
      }

    const submitHandler = async (e) => {
        e.preventDefault();
        await dispatch(updateProfile(name, email, avatar));
        await dispatch(loadUser());
        history('/account');
    }

    useEffect(() => {
        if(updateError) {
            alert.error(updateError);
            dispatch({type: "clearUpdateErrors"});
        }
        if(updateMessage) {
            alert.success(updateMessage);
        }
    }, [dispatch, alert, error, updateError, updateMessage]);
  return ( updateLoading ? 
    <Loader/> : 
    <div className='updateProfile'>
        <form className="updateProfileForm" onSubmit={submitHandler}>
        <Typography variant = "h3" style = {{ padding: "2vmax" }}>Social Media</Typography>
        <Avatar 
            src = {avatarPrev} 
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
              className = "updateProfileInputs" 
              required
            />
            <input 
              placeholder='Email' 
              type = "email" 
              value = {email} 
              onChange = {(e) => setEmail(e.target.value)}
              className = "updateProfileInputs" 
              required
            />


            <Button disabled = {updateLoading} type = "submit">Update Profile</Button>
        </form>
    </div>
  )
}

export default UpdateProfile