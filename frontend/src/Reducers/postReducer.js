import {createReducer} from '@reduxjs/toolkit'

const initialState = {
    posts: [],
    loading: false,
    post: {},
    index: -1,
};

export const likeReducer = createReducer(initialState, {
    likeRequest: (state) => {
        state.loading = true;
    },
    likeSuccess: (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.post = action.payload.post;
    },
    likeFailure: (state, action) => {
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




// comment Reducer

export const commentReducer = createReducer(initialState, {
    addCommentRequest: (state) => {
        state.loading = true;
    },
    addCommentSuccess: (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.post = action.payload.post;
    },
    addCommentFailure: (state, action) => {
        state.loading = false;
        state.commentError = action.payload;
    },
    // delete comment handler 

    deleteCommentRequest: (state) => {
        state.loading = true;
    },

    deleteCommentSuccess: (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.post = action.payload.post;
    },

    deleteCommentFailure: (state, action) => {
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





// getUpdated post not needed now
export const updateSinglePostReducer = createReducer(initialState, {
    updateSinglePostRequest: (state) => {
        state.loading = true;
    },
    updateSinglePostSuccess: (state, action) => {
        state.loading = false;
        state.success = true;
        state.post = action.payload;
    },
    updateSinglePostFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors: (state) => {
        state.error = null;
    },
});


// myPost Reducer 
export const myPostReducer = createReducer(initialState, {
    myPostRequest: (state) => {
        state.loading = true;
    },
    myPostSuccess: (state, action) => {
        state.loading = false;
        state.posts = action.payload;
    },
    // icrease decrease myPost component likes
    increaseDecreaseMyPostLike: (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex((l) => l._id === action.payload.post._id);
        if(index !== -1){
            state.posts[index].likes = action.payload.post.likes;
        }
    },
    // add update comment on myPosts
    addModifyCommentOnMyPost: (state, action) => {
        state.loading = false;
        if(state.posts.length > 0){
            const index = state.posts.findIndex((l) => l._id === action.payload.post._id);
            if(index !== -1){
                state.posts[index].comments = action.payload.post.comments;
            }
        }
    },

    myPostfailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors: (state) => {
        state.error = null;
    },
});

export const addNewPostReducer = createReducer(initialState, {
    addNewPostRequest: (state) => {
        state.loading = true;
    },

    addNewPostSuccess: (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
    },

    addNewPostFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    
    // update Caption

    updateCaptionRequest: (state) => {
        state.loading = true;
    },

    updateCaptionSuccess: (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
    },

    updateCaptionFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    // delete post handler reducer
    deletePostRequest: (state) => {
        state.loading = true;
    },

    deletePostSuccess: (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
    },

    deletePostFailure: (state, action) => {
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

export const userPostsReducer = createReducer(initialState, {
    userPostsRequest: (state) => {
        state.loading = true;
    },
    userPostsSuccess: (state, action) => {
        state.loading = false;
        state.posts = action.payload;
    },
    // userPost Like increase decrease
    increaseDecreaseUserLike: (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex((l) => l._id === action.payload.post._id);
        if(index !== -1){
            state.posts[index].likes = action.payload.post.likes;
        }
        
    },
    // add and update comment on other user profile
    addRemoveCommentOnUserProfile: (state, action) => {
        state.loading = false;
        if(state.posts.length > 0){
            const index = state.posts.findIndex((l) => l._id === action.payload.post._id);
            if(index !== -1){
                state.posts[index].comments = action.payload.post.comments;
            }
        }
    },

    userPostsFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors: (state) => {
        state.error = null;
    }
});