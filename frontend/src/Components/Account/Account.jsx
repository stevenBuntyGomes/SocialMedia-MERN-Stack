import React, {useState, useEffect} from 'react'
import './Account.css'
import {useDispatch, useSelector} from 'react-redux'
import {getMyPosts, logoutUser, deleteMyProfile, getFollowingPosts} from '../../Actions/userAction'
import { useSelect } from '@mui/base'
import {useAlert} from 'react-alert'
import Post from '../Post/Post'
import {Typography, Avatar, Button, Dialog} from '@mui/material'
import Loader from '../Loader/Loader'
import {Link} from 'react-router-dom'
import User from '../User/User'

const Account = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const [followersToggle, setFollowersToggle] = useState(false);

  const [followingToggle, setFollowingToggle] = useState(false);

  const {loading, error, posts} = useSelector((state) => state.myPosts);
  const {user, loading: userLoading, error: deleteProfileError, message} = useSelector((state) => state.user);


  // logout handler

  const logoutHandler = async () => {
    await dispatch(logoutUser());
    alert.success("user loged out successfully");
  }

  const deleteProfileHandler = () => {
    dispatch(deleteMyProfile());
    dispatch(logoutUser());
  }

  useEffect(() => {
    if(error){
      alert.error(error);
      dispatch({type: "clearErrors"});
    }
    if(deleteProfileError){
      alert.error(deleteProfileError);
      dispatch({type: "clearErrors"});
    }

    dispatch(getMyPosts());
    dispatch(getFollowingPosts());
  }, [dispatch, alert, error]);
  return loading === true || userLoading === true ? (
    <Loader/>
  ) :  (
    <div className = 'account'>
        <div className="accountleft">
                {posts && posts.length > 0 ? posts.map((post, index) => (
                    <Post 
                        key = {index}
                      // postImage="https://scrc.siu.edu/_common/images/new-images/rb3.jpg"
                        post = {post}
                        isAccount = {true}
                        isDelete = {true}
                    />
                )) : (
                    <Typography variant='h6'>No Posts Yet</Typography>
                )}
        </div>
        <div className="accountright">
            <Avatar src = {user.avatar.url}
              sx = {{ height: "8vmax", width: "8vmax" }}
            />
            <Typography variant = "h6">{user.name}</Typography>
            <div>
              <button onClick={() => setFollowersToggle(!followersToggle)}>
                <Typography>Followers</Typography>
              </button>
                <Typography>{user.followers.length}</Typography>
            </div>
            <div>
              <button onClick ={() => setFollowingToggle(!followingToggle)}>
                <Typography>Following</Typography>
              </button>
                <Typography>{user.following.length}</Typography>
            </div>
            <div>
                <Typography>Posts</Typography>

                <Typography>{user.posts.length}</Typography>
            </div>
            <Button variant = "contained" onClick = {logoutHandler}>
              Logout
            </Button>
            <Link to = "/update/profile">
                Edit Profile
            </Link>
            <Link to = "/update/password">
                Change Password 
            </Link>

            <Button
              variant = "text"
              style = {{ color: "red", margin: "2vmax" }}
              onClick = {deleteProfileHandler}
              disabled = {userLoading}
            >
              Delete My Profile
            </Button>


            {/* followers dialogue box */}
            <Dialog open = {followersToggle} onClose = {() => setFollowersToggle(!followersToggle)}>
              <div className="DialogBox">
                  {user && user.followers.length > 0 ? user.followers.map((follower) => (
                      <User
                          key = {follower._id}
                          userId = {follower._id}
                          name = {follower.name}
                          avatar = {follower.avatar && follower.avatar.url}
                      />
                  ))  : (
                      <Typography variant = "h6" style = {{ margin: "2vmax" }}>No followers yet</Typography>
                  )}
              </div>
          </Dialog>


          {/* following dialog box */}

          <Dialog open = {followingToggle} onClose = {() => setFollowingToggle(!followingToggle)}>
              <div className="DialogBox">
                  {user && user.following.length > 0 ? user.following.map((following) => (
                      <User
                          key = {following._id}
                          userId = {following._id}
                          name = {following.name}
                          avatar = {following.avatar && following.avatar.url}
                      />
                  ))  : (
                      <Typography variant = "h6" style = {{ margin: "2vmax" }}>No followers yet</Typography>
                  )}
              </div>
          </Dialog>
        </div>
    </div>
  )
}

export default Account