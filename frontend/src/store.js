import {configureStore} from '@reduxjs/toolkit'
import {
    userReducer, 
    postOfFollowingReducer, 
    allUsersReducer,
    userProfileReducer,
    userFollowReducer,
} from './Reducers/userReducer'
import {
    likeReducer, 
    updateSinglePostReducer, 
    commentReducer, 
    myPostReducer,
    addNewPostReducer,
    userPostsReducer,
} from './Reducers/postReducer'
import {commentUpdateReducer} from './Reducers/postCommentReducer'

const store = configureStore({
    reducer: {
        user: userReducer,
        postOfFollowing: postOfFollowingReducer,
        allUsers: allUsersReducer,
        like: likeReducer,
        updateSinglePost: updateSinglePostReducer,
        comment: commentReducer,
        postComment: commentUpdateReducer,
        myPosts: myPostReducer,
        addNewPost: addNewPostReducer,
        userProfile: userProfileReducer,
        userPosts: userPostsReducer,
        userFollow: userFollowReducer,
    }
});

export default store;