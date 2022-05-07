import React, {useEffect, useState} from 'react'
import './UpdatePassword.css'
import {Typography, Button} from '@mui/material'
import {useSelector, useDispatch} from 'react-redux'
import {useAlert} from 'react-alert'
import {loadUser, updatePassword} from '../../Actions/userAction'
import {useNavigate} from 'react-router-dom'

const UpdatePassword = () => {
    const history = useNavigate();
    const  [oldPassword, setOldPassword] = useState('');
    const  [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();
    const alert = useAlert();
    const {error, message, loading} = useSelector((state) => state.user);

    const submitHandler = async (e) => {
        e.preventDefault();
        await dispatch(updatePassword(oldPassword, newPassword, confirmPassword));
    }

    // useEffect
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch({ type: "clearErrors" });
          }
      
          if (message) {
            alert.success(message);
            dispatch({type: "clearMessage"});
            dispatch(loadUser());
            history('/');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
          }
    }, [dispatch, error, alert, message]);
  return (
    <div className = "updatePassword">
        <form className='updatePasswordForm' onSubmit={submitHandler}>
            <Typography variant="h3" style={{ padding: "2vmax" }}>
                Social Aap
            </Typography>
            {/* old password */}
            <input
                type="password"
                placeholder="Old Password"
                required
                value={oldPassword}
                className="updatePasswordInputs"
                onChange={(e) => setOldPassword(e.target.value)}
            />
            {/* new password */}
            <input
                type="password"
                placeholder="New Password"
                required
                className="updatePasswordInputs"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            {/* confirm password */}
            <input
                type="password"
                placeholder="Confirm Password"
                required
                className="updatePasswordInputs"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button disabled={loading} type="submit">
                Change Password
            </Button>
        </form>
    </div>
  )
}

export default UpdatePassword