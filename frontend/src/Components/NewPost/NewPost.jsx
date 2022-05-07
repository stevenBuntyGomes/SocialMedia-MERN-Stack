import React, { useState, useEffect } from 'react'
import './NewPost.css'
import {Button, Typography} from '@mui/material'
import {useDispatch, useSelector} from 'react-redux'
import {createNewPost} from '../../Actions/postAction'
import {useAlert} from 'react-alert'
import {useNavigate} from 'react-router-dom'
import {loadUser} from '../../Actions/userAction'

const NewPost = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const alert = useAlert();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");

  const {loading, error, message} = useSelector((state) => state.addNewPost);


  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const Reader = new FileReader();

    Reader.onload = () => {
      if(Reader.readyState===2){
        setImage(Reader.result);
      }
    };

    Reader.readAsDataURL(file);
  }


  const submitHandler = async (e) => {
    e.preventDefault();
    await dispatch(createNewPost(caption, image));
  }


  useEffect(() => {
    if(error){
      alert.error(alert);
      dispatch({type: "clearErrors"});
    }
    if(message){
      alert.success(message);
      dispatch({type: "clearMessage"});
      setCaption('');
      setImage(null);
      dispatch(loadUser());
      history('/account');
      
    }
  }, [dispatch, alert, message, error]);
  return (
    <div className='newPost'>
      <form className = 'newPostForm' onSubmit={submitHandler}>
        <Typography variant = 'h3'>Add New Post</Typography>
        {image && (
          <img src = {image} alt = 'post image'/>
        )}
        <input 
          type = 'file' 
          accept='image/*' 
          onChange={handleImageChange} 
        />
        <input 
          type = 'text' 
          placeholder = 'caption...' 
          value = {caption} 
          onChange = {(e) => setCaption(e.target.value)} 
        />
        <Button disabled = {loading} type = "submit">Post</Button>
      </form>
    </div>
  )
}

export default NewPost