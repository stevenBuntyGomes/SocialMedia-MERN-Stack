import React, {useEffect} from 'react'
import './Home.css'
import User from '../User/User'
import Post from '../Post/Post'
import {useDispatch, useSelector} from 'react-redux'
import {getFollowingPosts, getAllUsers, getMyPosts} from '../../Actions/userAction'
import Loader from '../../Components/Loader/Loader'
import { Typography } from '@mui/material'
import {useAlert} from 'react-alert'

const Home = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const {loading, posts, error} = useSelector((state) => state.postOfFollowing);
    const {loading: usersLoading, users, error: AllUserError} = useSelector((state) => state.allUsers);
    useEffect(() => {
        dispatch(getFollowingPosts());
        dispatch(getAllUsers());
        dispatch(getMyPosts());   

        if(error){
            alert.error(error);
            dispatch({type: "clearErrors"});
        }
    }, [dispatch, error, alert, loading]);

    // useEffect(() => {
    //     if(error){
    //         alert.error(error);
    //         dispatch({type: "clearErrors"});
    //     }
    //     if(message){
    //         alert.success(message);
    //         dispatch({type: "clearMessage"});
    //     }

    // }, [alert, likeError, message]);
    window.addEventListener("contextmenu", (e) => e.preventDefault());
  return (
    loading===true || usersLoading===true ? <Loader/> : (
        <div className = "home">
            <div className="homeleft">
                {posts && posts.length > 0 ? posts.map((post, index) => (
                    <Post 
                        key = {index}
                        // postImage="https://scrc.siu.edu/_common/images/new-images/rb3.jpg"
                        post = {post}
                    />
                )) : (
                    <Typography variant='h6'>No Posts Yet</Typography>
                )}
                
            </div>
            <div className="homeright">
                {
                    users && users.length > 0 ? users.map((user) => (
                        <User
                            key = {user._id}
                            userId = {user._id}
                            name = {user.name}
                            avatar = {user.avatar.url}
                        />
                    )) : (
                        <Typography variant='h6'>No users Yet</Typography>
                    )
                }
                
            </div>
        </div>
    )
  )
}

export default Home