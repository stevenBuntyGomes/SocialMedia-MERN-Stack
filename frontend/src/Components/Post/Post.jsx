import React, {useState, useEffect} from 'react'
import './Post.css'
import {Avatar, Typography, Dialog} from '@mui/material'
import {Link} from 'react-router-dom'
import {likePost, updateSinglePost, addCommentOnPost, updatePost, deletePost} from '../../Actions/postAction'
import {
    MoreVert,
    Favorite,
    FavoriteBorder,
    ChatBubbleOutline,
    DeleteOutline,
    AlignHorizontalLeftRounded,
  } from "@mui/icons-material";
  import {Button} from '@mui/material'
  import {useDispatch, useSelector} from 'react-redux'
  import {useAlert} from 'react-alert'
  import User from '../User/User'
  import CommentCard from '../CommentCard/CommentCard'
  import { getFollowingPosts, getMyPosts, loadUser } from '../../Actions/userAction'

const Post = ({
    post,
    userParams = 0,
    isDelete = false,
    isAccount = false,
}) => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const {updatedPost, message, error: likeError, success: postLikeSuccess} = useSelector((state) => state.like);
    const {message: postCommentmessage, success: commentSuccess, post: commentPost} = useSelector((state) => state.comment);
    const [liked, setLiked] = useState(-1);
    const [userLikes, setUserLikes] = useState(false);
    // get following posts
    const {loading, posts, error} = useSelector((state) => state.postOfFollowing);

    // states for comments
    const [commentValue, setCommentValue] = useState("");
    const [commentToggle, setCommentToggle] = useState(false);
    const [captionValueUp, setCaptionValueUp] = useState(post.caption);
    const [captionToggle, setCaptionToggle] = useState(false);
    const {user} = useSelector((state) => state.user);

    const handleLike = () => {
        dispatch(likePost(post._id, userParams));
        console.log(post._id);
    };
    
    const addCommentHandler = (e) => {
        e.preventDefault();
        dispatch(addCommentOnPost(post._id, commentValue));
        setCommentToggle(false);
        setCommentValue('');
        // setCommentsUp([]);
        // if(isAccount){
        //     dispatch(getMyPosts());
        // }else{
        //     dispatch(getFollowingPosts());
        // }
    }

    const updateCaptionHandler = (e) => {
        e.preventDefault();
        dispatch(updatePost(post._id, captionValueUp));
        dispatch(getMyPosts());
    };

    const deletePostHandler = async () => {
        await dispatch(deletePost(post._id));
        dispatch(getMyPosts());
        dispatch(loadUser());
    };

    useEffect(() => {

        // if(post.likes.length > 0){
        //     post.likes.forEach((item) => {
        //         if(item._id === user._id){
        //             setLiked(0);
        //         }
        //     });
        // }

        if(likeError){
            alert.error(likeError);
            dispatch({type: "clearErrors"});
        }
        // if(message){
        //     dispatch(updateSinglePost(postId));
        //     alert.success(message);
        //     console.log(post.likes);
        // }

        // update Comment for users 
        // if(postCommentmessage){
        //     alert.success(postCommentmessage);
        //     setCommentsUp(commentPost.comments);
        // }
        
        // if(updatePostSuccess){
        //     setLikesUp(updatedPost.likes);
        //     console.log(likesUp.length);
        //     console.log(likesUp);
        // }

    },[user._id, likeError]);
  return (
    <div className = "post">
        <div className="postHeader">
            {isAccount ? <Button onClick = {() => setCaptionToggle(!captionToggle)}><MoreVert/></Button> : null}
        </div>
        <img src = {post.image.url} alt = "post image"/>
        <div className="postDetails">
            <Avatar src = {post?.owner.avatar.url} alt = "User Image" sx = {{ 
                height: "3vmax",
                width: "3vmax",
             }}/>
             <Link to = {`/user/${post?.owner._id}`}>
                 <Typography fontWeight={700}>{post.owner.name && post.owner.name}</Typography>
             </Link>
             <Typography
                fontWeight={100}
                color = "rgb(0, 0, 0, 0.582)"
                style = {{ alignSelf: "center" }}
             >
                 {post.caption}
             </Typography>
        </div>
        <button className = "postLikeButton" 
            onClick = {() => setUserLikes(!userLikes)}
            disabled = {post.likes && post.likes.length === 0 ? true : false}
        >
            <Typography>{post.likes && post.likes.length} Likes</Typography>
        </button>
        <button className = "postLikeButton" 
            onClick = {() => setCommentToggle(!commentToggle)}
            disabled = {post?.comments && post?.comments.length === 0 ? true : false}
        >
            <Typography>{post?.comments && post?.comments.length} Comments</Typography>
        </button>
        <div className="postFooter">
             <Button onClick = {handleLike}>
                 {
                    post?.likes?.findIndex((l) => l._id === user._id) > -1 ? 
                    <Favorite style = {{ color: "red" }}/> : 
                    <FavoriteBorder/>
                }
             </Button>
             <Button onClick = {() => setCommentToggle(!commentToggle)}>
                 <ChatBubbleOutline/>
             </Button>
             {isDelete ? <Button onClick = {deletePostHandler}>
                 <DeleteOutline/>
             </Button> : null}
        </div>
        {/* like Dialog Box */}
        <Dialog open = {userLikes} onClose = {() => setUserLikes(!userLikes)}>
            <div className="DialogBox">
                <Typography variant = "h4">Liked By</Typography>
                {post.likes && post.likes.length > 0 ? post.likes.map((like) => (
                    <User
                        key = {like._id}
                        userId = {like._id}
                        name = {like.name}
                        avatar = {like.avatar.url}
                    />
                ))  : (
                    <Typography variant = "h6">No Likes Yet</Typography>
                )}
            </div>
        </Dialog>
        {/* comment dialog box */}
        <Dialog open = {commentToggle} onClose = {() => setCommentToggle(!commentToggle)}>
            <div className = "DialogBox">
                <Typography variant = "h4">Comments</Typography>
                <form className = "commentForm" onSubmit={addCommentHandler}>
                    <input 
                        type = "text" 
                        value = {commentValue} 
                        onChange = {(e) => setCommentValue(e.target.value)}
                        placeholder = "comment here..."
                        required
                    />
                    <Button variant='contained' type = "submit">
                        Add Comment
                    </Button>
                </form>
                {/* comment component */}
                {
                    post?.comments.length > 0 ? post?.comments.map((comment, index) => (
                        <CommentCard
                            key = {index}
                            userId = {comment.user._id}
                            name = {comment.user.name}
                            avatar = {comment.user.avatar.url}
                            comment = {comment.comment}
                            commentId = {comment._id}
                            postId = {post._id}
                            isAccount = {isAccount}
                        >

                        </CommentCard>
                    )) : (
                        <Typography>No Comments Yet</Typography>
                    ) 
                }
            </div>
        </Dialog>
        {/* caption update dialogue box */}
        <Dialog open = {captionToggle} onClose = {() => setCaptionToggle(!captionToggle)}>
            <div className = "DialogBox">
                <Typography variant = "h4">Update Caption</Typography>
                <form className = "commentForm" onSubmit={updateCaptionHandler}>
                    <input 
                        type = "text" 
                        value = {captionValueUp} 
                        onChange = {(e) => setCaptionValueUp(e.target.value)}
                        placeholder = "update caption..."
                        required
                    />
                    <Button variant='contained' type = "submit">
                        Update Caption
                    </Button>
                </form>
            </div>
        </Dialog>
    </div>
  )
}

export default Post