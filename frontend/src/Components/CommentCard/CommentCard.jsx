import React, {useState, useEffect} from 'react'
import './CommentCard.css'
import {Link} from 'react-router-dom'
import {Button, Typography} from '@mui/material'
import {Delete} from '@mui/icons-material'
import {useDispatch, useSelector} from 'react-redux'
import {deleteCommentOnPost} from '../../Actions/postAction'
import { getFollowingPosts, getMyPosts } from '../../Actions/userAction'

const CommentCard = ({
    userId,
    name,
    avatar,
    comment,
    commentId,
    postId,
    isAccount,
}) => {
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.user);

    const deleteCommentHandler =() => {
        dispatch(deleteCommentOnPost(postId, commentId));

        // work to be done.. Really important

        // if(isAccount) {
        //     dispatch(getMyPosts());
        // }else{
        //     dispatch(getFollowingPosts());
        // }
    }
  return (
    <div className='commentUser'>
        <Link to = {`/user/${userId}`}>
            <img src = {avatar} alt = {name}/>
            <Typography style = {{ minWidth: "6vmax" }}>{name}</Typography>
        </Link>
        <Typography>{comment}</Typography>
        {
            isAccount === true ? (
                <Button onClick = {deleteCommentHandler}>
                    <Delete/>
                </Button>
            ) : userId === user._id ? (
                <Button onClick = {deleteCommentHandler}>
                    <Delete/>
                </Button>
            ) : null
        }
    </div>
  )
}

export default CommentCard