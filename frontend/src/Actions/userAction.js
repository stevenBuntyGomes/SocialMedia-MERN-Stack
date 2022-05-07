import axios from 'axios'

// login user
export const loginUser = (email, password) => async (dispatch) => {
    try{
        dispatch({type: "LoginRequest"});
        const config = {
            headers: {"Content-Type": "application/json"},
        };
        const {data} = await axios.post('/api/v1/login', {email, password}, config);
        dispatch({
            type: "LoginSuccess",
            payload: data.user,
        });

    } catch(error){
        dispatch({
            type: "LoginFailure",
            payload: error.response.data.message,
        });
    }
}

// load user

export const loadUser = () => async (dispatch) => {
    try{
        dispatch({type: "LoadUserRequest"});
        const {data} = await axios.get('/api/v1/me');

        dispatch({
            type: "LoadUserSuccess",
            payload: data.user,  
        });
    }
    catch(error){
        dispatch({
            type: "LoadUserFailure",
            payload: error.response.data.message,
        });
    }
}

// get following posts
export const getFollowingPosts = () => async (dispatch) => {
    try{
        dispatch({type: "postOfFollowingRequest"});
        const {data} = await axios.get(`/api/v1/posts`);
        dispatch({
            type: "postOfFollowingSuccess",
            payload: data.posts,
        });

    } catch(error){
        dispatch({
            type: "postOfFollowingFailure",
            payload: error.response.data.message,
        });
    }
}



// get my posts for my users


export const getMyPosts = () => async (dispatch) => {
    try{
        dispatch({type: "myPostRequest"});
        const {data} = await axios.get(`/api/v1/my/posts`);
        dispatch({
            type: "myPostSuccess",
            payload: data.posts,
        });

    } catch(error){
        dispatch({
            type: "myPostfailure",
            payload: error.response.data.message,
        });
    }
}


// get all users
export const getAllUsers = (name= "") => async (dispatch) => {
    try{
        dispatch({type: "allUsersRequest"});
        const {data} = await axios.get(`/api/v1/users?name=${name}`);
        dispatch({
            type: "allUsersSuccess",
            payload: data.users,
        });

    } catch(error){
        dispatch({
            type: "allUsersFailure",
            payload: error.response.data.message,
        });
    }
}


// logout user

export const logoutUser = () => async (dispatch) => {
    try{
        dispatch({type: "logoutUserRequest"});
        // const config = {
        //     headers: {"Content-Type": "application/json"},
        // };
        await axios.get('/api/v1/logout');
        dispatch({
            type: "logoutUserSuccess",
        });

    } catch(error){
        dispatch({
            type: "logoutUserFailure",
            payload: error.response.data.message,
        });
    }
}


// register user 

export const registerUser = (name, email, password, avatar) => async (dispatch) => {
    try{
        dispatch({type: "RegisterRequest"});
        const config = {
            headers: {"Content-Type": "application/json"},
        };
        const {data} = await axios.post('/api/v1/register', {name, email, password, avatar}, config);
        dispatch({
            type: "RegisterSuccess",
            payload: data.newUser,
        });

    } catch(error){
        dispatch({
            type: "Registerfailure",
            payload: error,
        });
    }
}


// update user
export const updateProfile = (name, email, avatar) => async (dispatch) => {
    try{
        dispatch({type: "updateProfileRequest"});
        const config = {
            headers: {"Content-Type": "application/json"},
        };
        const {data} = await axios.put('/api/v1/update/profile', {name, email, avatar}, config);
        dispatch({
            type: "updateProfileSuccess",
            payload: data.message,
        });

    } catch(error){
        dispatch({
            type: "updateProfileFailure",
            payload: error,
        });
    }
}

// update password action

export const updatePassword = (oldPassword, newPassword, confirmPassword) => async (dispatch) => {
    try{
        dispatch({type: "updatePasswordRequest"});
        const config = {
            headers: {"Content-Type": "application/json"},
        };
        const {data} = await axios.put('/api/v1/update/password', {oldPassword, newPassword, confirmPassword}, config);
        dispatch({
            type: "updatePasswordSuccess",
            payload: data.message,
        });

    } catch(error){
        dispatch({
            type: "updatePasswordFailure",
            payload: error.response.data.message,
        });
    }
}


// delete profile action

export const deleteMyProfile = () => async (dispatch) => {
    try{
        dispatch({type: "deleteProfileRequest"});
        // const config = {
        //     headers: {"Content-Type": "application/json"},
        // };
        const {data} = await axios.delete('/api/v1/delete/me');
        dispatch({
            type: "deleteProfileSuccess",
            payload: data.message,
        });

    } catch(error){
        dispatch({
            type: "deleteProfileFailure",
            payload: error.response.data.message,
        });
    }
}


// forgotPassword actiion

export const forgotPassword = (email) => async (dispatch) => {
    try{
        dispatch({type: "forgotPasswordRequest"});
        const config = {
            headers: {"Content-Type": "application/json"},
        };
        const {data} = await axios.post('/api/v1/forgot/password', {email}, config);
        dispatch({
            type: "forgotPasswordSuccess",
            payload: data.message,
        });

    } catch(error){
        dispatch({
            type: "forgotPasswordFailure",
            payload: error.response.data.message,
        });
    }
}


// reset password

export const resetPassword = (token, password) => async (dispatch) => {
    try{
        dispatch({type: "resetPasswordRequest"});
        const config = {
            headers: {"Content-Type": "application/json"},
        };
        const {data} = await axios.put(`/api/v1/users/password/reset/${token}`, {password}, config);
        dispatch({
            type: "resetPasswordSuccess",
            payload: data.message,
        });

    } catch(error){
        dispatch({
            type: "resetPasswordFailure",
            payload: error.response.data.message,
        });
    }
}


// getUser posts action

export const getUserPosts = (id) => async (dispatch) => {
    try {
      dispatch({
        type: "userPostsRequest",
      });
  
      const { data } = await axios.get(`/api/v1/user/posts/${id}`);
      dispatch({
        type: "userPostsSuccess",
        payload: data.posts,
      });
    } catch (error) {
      dispatch({
        type: "userPostsFailure",
        payload: error.response.data.message,
      });
    }
  };



// get User profile action

export const getUserProfile = (id) => async (dispatch) => {
    try{
        dispatch({type: "userProfileRequest"});
        const {data} = await axios.get(`/api/v1/user/${id}`);
        dispatch({
            type: "userProfileSuccess",
            payload: data.user,
        });

    } catch(error){
        dispatch({
            type: "userProfileFailure",
            payload: error.response.data.message,
        });
    }
}

// follow and unfollow users

export const followAndUnfollowUser = (id) => async (dispatch) => {
    try{
        dispatch({type: "followUserRequest"});
        const {data} = await axios.get(`/api/v1/follow/${id}`);
        dispatch({
            type: "followUserSuccess",
            payload: data.message,
        });

    } catch(error){
        dispatch({
            type: "followUserFailure",
            payload: error.response.data.message,
        });
    }
}



