import React, { useEffect, useState } from "react";
import { Avatar, Button, Dialog, Typography } from "@mui/material";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import {
    followAndUnfollowUser,
    getUserPosts,
    getUserProfile,
  } from "../../Actions/userAction";
import Post from '../Post/Post'
import User from "../User/User";

const UserProfile = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const params = useParams();
    

    // var declaration
    const [followersToggle, setFollowersToggle] = useState(false);
    const [followingToggle, setFollowingToggle] = useState(false);
    const [following, setFollowing] = useState(false);
    const [myProfile, setMyProfile] = useState(false);

    const {
      user,
      loading: userLoading,
      error: userError,
    } = useSelector((state) => state.userProfile);
    const { user: me } = useSelector((state) => state.user);
    const { loading, error, posts } = useSelector((state) => state.userPosts);
    const {
      error: followError,
      message,
      loading: followLoading,
    } = useSelector((state) => state.userFollow);
  

    const followHandler = async () => {
      setFollowing(!following);
      await dispatch(followAndUnfollowUser(user._id));
      dispatch(getUserProfile(params.id));
    }

    useEffect(() => {
      dispatch(getUserProfile(params.id));
      dispatch(getUserPosts(params.id));
    }, [dispatch, params.id]);

    useEffect(() => {
      setFollowing(false);
      if(me._id === params.id){
        setMyProfile(true);
      }
      if(user){
        user.followers.forEach((item) => {
          if(item._id === me._id){
            setFollowing(true);
          }else{
            setFollowing(false);
          }
        });
      }
    }, [user, me._id, params.id]);

    useEffect(() => {
      if(error){
        alert.error(error);
        dispatch({type: 'clearErrors'});
      }
      if(followError){
        alert.error(followError);
        dispatch({type: 'clearErrors'});
      }
      if(userError){
        alert.error(userError);
        dispatch({type: 'clearErrors'});
      }
      
    },[dispatch, alert, error, followError, userError]);


    return loading === true || userLoading === true ? (
      <Loader />
    ) : (
      <div className="account">
        <div className="accountleft">
          {posts && posts.length > 0 ? (
            posts.map((post, index) => (
              <Post 
                        key = {index}
                      // postImage="https://scrc.siu.edu/_common/images/new-images/rb3.jpg"
                        post = {post}
                        userParams = {params.id}
                    />
            ))
          ) : (
            <Typography variant="h6">User has not made any post</Typography>
          )}
        </div>
        <div className="accountright">
          {user && (
            // empty fragment used because multiple component inside
            <> 
              <Avatar
                src={user.avatar.url}
                sx={{ height: "8vmax", width: "8vmax" }}
              />
  
              <Typography variant="h5">{user.name}</Typography>
  
              <div>
                <button onClick={() => setFollowersToggle(!followersToggle)}>
                  <Typography>Followers</Typography>
                </button>
                <Typography>{user.followers.length}</Typography>
              </div>
  
              <div>
                <button onClick={() => setFollowingToggle(!followingToggle)}>
                  <Typography>Following</Typography>
                </button>
                <Typography>{user.following.length}</Typography>
              </div>
  
              <div>
                <Typography>Posts</Typography>
                <Typography>{user.posts.length}</Typography>
              </div>
  
              {myProfile ? null : (
                <Button
                  variant="contained"
                  style={{ background: following ? "red" : "blue" }}
                  onClick={followHandler}
                  disabled={followLoading}
                >
                  {following ? "Unfollow" : "Follow"}
                </Button>
              )}
            </>
          )}
          <Dialog
            open={followersToggle}
            onClose={() => setFollowersToggle(!followersToggle)}
          >
            <div className="DialogBox">
              <Typography variant="h4">Followers</Typography>
  
              {user && user.followers.length > 0 ? (
                user.followers.map((follower) => (
                  <User
                    key={follower._id}
                    userId={follower._id}
                    name={follower.name}
                    avatar={follower.avatar.url}
                  />
                ))
              ) : (
                <Typography style={{ margin: "2vmax" }}>
                  You have no followers
                </Typography>
              )}
            </div>
          </Dialog>
  
          <Dialog
            open={followingToggle}
            onClose={() => setFollowingToggle(!followingToggle)}
          >
            <div className="DialogBox">
              <Typography variant="h4">Following</Typography>
  
              {user && user.following.length > 0 ? (
                user.following.map((follow) => (
                  <User
                    key={follow._id}
                    userId={follow._id}
                    name={follow.name}
                    avatar={follow.avatar.url}
                  />
                ))
              ) : (
                <Typography style={{ margin: "2vmax" }}>
                  You're not following anyone
                </Typography>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    );
}

export default UserProfile