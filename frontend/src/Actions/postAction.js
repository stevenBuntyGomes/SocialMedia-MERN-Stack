import axios from 'axios'

// likePost
export const likePost = (id, userParams) => async (dispatch) => {
    try{
        dispatch({type: "likeRequest"});
        dispatch({type: "postOfFollowingRequest"});
        const {data} = await axios.get(`/api/v1/post/${id}`);
        dispatch({
            type: "likeSuccess",
            payload: data,
        });
        // inclrease Decrease home component likes
        dispatch({
            type: "increaseDecreaseUserLikeOnPost",
            payload: data,
        });
        //icrease decrease myPost component likes
        dispatch({
            type: "increaseDecreaseMyPostLike",
            payload: data,
        });
        dispatch({
            type: "increaseDecreaseUserLike",
            payload: data,
        });

    } catch(error){
        // dispatch({
        //     type: "likeFailure",
        //     payload: error?.response?.data.message,
        // });
        console.log(error);
    }
}
// like post of other user profile
export const likePostOfOtherUser = (id) => async (dispatch) => {
    try{
        dispatch({type: "likeRequest"});
        dispatch({type: "userPostsRequest"});
        const {data} = await axios.get(`/api/v1/post/${id}`);
        //increase decrease userProfile component likes
        dispatch({
            type: "increaseDecreaseUserLike",
            payload: data,
        });
    }catch(error){
        console.log(error);
    }
}


// add comment on post
export const addCommentOnPost = (id, comment) => async (dispatch) => {
    try{
        dispatch({type: "addCommentRequest"});
        const config = {
            headers: {"Content-Type": "application/json"},
        };
        const {data} = await axios.put(`/api/v1/post/comment/${id}`, {comment}, config);
        dispatch({
            type: "addCommentSuccess",
            payload: data,
        });
        dispatch({
            type: "addNewCommentToFollowingUserPosts",
            payload: data,
        });
        // add and modify comment on myPosts dispatch
        dispatch({
            type: "addModifyCommentOnMyPost",
            payload: data,
        });
        // add and modify comment on userProfile dispatch
        dispatch({
            type: "addRemoveCommentOnUserProfile",
            payload: data,
        });


    } catch(error){
        // dispatch({
        //     type: "addCommentFailure",
        //     payload: error.response.data.message,
        // });
        console.log(error);
    }
}


// delete comment from post

export const deleteCommentOnPost = (id, commentId) => async (dispatch) => {
    try{
        dispatch({type: "deleteCommentRequest"});
        const {data} = await axios.delete(`/api/v1/post/comment/${id}`, {
            data: {commentId},
        });

        dispatch({
            type: "deleteCommentSuccess",
            payload: data
        });

        dispatch({
            type: "addNewCommentToFollowingUserPosts",
            payload: data,
        });
        // add and modify comment on myPosts dispatch
        dispatch({
            type: "addModifyCommentOnMyPost",
            payload: data,
        });
        // add and modify comment on userProfile dispatch
        dispatch({
            type: "addRemoveCommentOnUserProfile",
            payload: data,
        });
        
    }catch(error){
        dispatch({
            type: "deleteCommentFailure",
            payload: error.response.data.message,
        });
    }
}


// not used now reserved

export const updateSinglePost = (id) => async (dispatch) => {
    try{
        dispatch({type: "updateSinglePostRequest"});
        const config = {
            headers: {"Content-Type": "application/json"},
        };
        const {data} = await axios.post(`/api/v1/single/post/update`, {id}, config);
        dispatch({
            type: "updateSinglePostSuccess",
            payload: data.post,
        });
    } catch(error){
        dispatch({
            type: "updateSinglePostFailure",
            payload: error.response.data.message,
        });
    }
}


// create new post

export const createNewPost = (caption, image) => async (dispatch) => {
    try{
        dispatch({type: "addNewPostRequest"});

        const config = {
            headers: {"Content-Type": "application/json"},
        };

        const {data} = await axios.post(`/api/v1/post/upload`, {caption, image}, config);

        dispatch({
            type: "addNewPostSuccess",
            payload: data
        });
    }catch(error){
        dispatch({
            type: "addNewPostFailure",
            payload: error.response.data.message,
        });
    }
}


// update post

export const updatePost = (id, caption) => async (dispatch) => {
    try{
        dispatch({type: "updateCaptionRequest"});

        const config = {
            headers: {"Content-Type": "application/json"},
        };

        const {data} = await axios.put(`/api/v1/post/${id}`, {caption}, config);

        dispatch({
            type: "updateCaptionSuccess",
            payload: data
        });
    }catch(error){
        dispatch({
            type: "updateCaptionFailure",
            payload: error.response.data.message,
        });
    }
}


// delete post action

export const deletePost = (id) => async (dispatch) => {
    try{
        dispatch({type: "deletePostRequest"});

        // const config = {
        //     headers: {"Content-Type": "application/json"},
        // };

        const {data} = await axios.delete(`/api/v1/post/${id}`);

        dispatch({
            type: "deletePostSuccess",
            payload: data
        });
    }catch(error){
        dispatch({
            type: "deletePostFailure",
            payload: error.response.data.message,
        });
    }
}