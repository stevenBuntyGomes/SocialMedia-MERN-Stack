import {createReducer} from '@reduxjs/toolkit'
const initialState = {
    posts: [],
    loading: false,
    index: -1,
};

export const userReducer = createReducer(initialState, {
    // login user reducer
    LoginRequest: (state) => {
        state.loading = true;
    },
    LoginSuccess: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    },
    LoginFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },

    // register user reducer
    RegisterRequest: (state) => {
        state.loading = true;
    },
    RegisterSuccess: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    },
    Registerfailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },

    // load user reducer
    LoadUserRequest: (state) => {
        state.loading = true;
    },
    LoadUserSuccess: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    },
    LoadUserFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },

    // update Profile reducer
    updateProfileRequest: (state) => {
        state.updateLoading = true;
    },
    updateProfileSuccess: (state, action) => {
        state.updateLoading = false;
        state.updateMessage = action.payload;
    },
    updateProfileFailure: (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
    },
    clearUpdateErrors: (state) => {
        state.updateError = null;
    },


    // update Password reducer of user

    updatePasswordRequest: (state) => {
        state.loading = true;
    },
    updatePasswordSuccess: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },
    updatePasswordFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },


    // delete profile request

    deleteProfileRequest: (state) => {
        state.loading = true;
    },
    deleteProfileSuccess: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },
    deleteProfileFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    // forgot password reducer for user

    forgotPasswordRequest: (state) => {
        state.loading = true;
    },
    
    forgotPasswordSuccess: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },

    forgotPasswordFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    // reset password reducer for user
    resetPasswordRequest: (state) => {
        state.loading = true;
    },
    
    resetPasswordSuccess: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },

    resetPasswordFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    // logout user


    logoutUserRequest: (state) => {
        state.loading = true;
    },
    logoutUserSuccess: (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
    },
    logoutUserFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = true;
    },
    clearErrors: (state) => {
        state.error = null;
    },
    clearMessages: (state) => {
        state.message = null;
    }
});

export const postOfFollowingReducer = createReducer(initialState, {
    postOfFollowingRequest: (state) => {
        state.logaind = true;
    },

    postOfFollowingSuccess: (state, action) => {
        state.loading = false;
        state.posts = action.payload;
    },
    // increaseDecreaseUserLikeOnPost
    increaseDecreaseUserLikeOnPost: (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex((l) => l._id === action.payload.post._id);
        if(index !== -1){
            state.posts[index].likes = action.payload.post.likes;
        }
    },

    // addNewCommentToFollwoingUsers
    addNewCommentToFollowingUserPosts: (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex((l) => l._id === action.payload.post._id);
        if(index !== -1){
            state.posts[index].comments = action.payload.post.comments;
        }
    },


    postOfFollowingFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors: (state) => {
        state.error = null;
    },
});


// all user reducer
export const allUsersReducer = createReducer(initialState, {
    allUsersRequest: (state) => {
        state.loading = true;
    },
    allUsersSuccess: (state, action) => {
        state.loading = false;
        state.users = action.payload;
    },
    allUsersFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors: (state) => {
        state.error = null;
    },
}); 


// user pforile reducer

export const userProfileReducer = createReducer(initialState, {
    userProfileRequest: (state) => {
        state.loading = true;
    },
    userProfileSuccess: (state, action) => {
        state.loading = false;
        state.user = action.payload;
    },
    userProfileFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors: (state) => {
        state.error = null;
    },
});

// user following and follwers reducer

export const userFollowReducer = createReducer(initialState, {
    followUserRequest: (state) => {
        state.loading = true;
    },
    followUserSuccess: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },
    followUserFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors: (state) => {
        state.error = null;
    },
    clearMessage: (state) => {
        state.message = null;
    },
});