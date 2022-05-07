import {createReducer} from '@reduxjs/toolkit'

const initialState = {};

export const commentUpdateReducer = createReducer(initialState, {
    addNewCommentSuccess: (state, action) => {
        state.successMessage = action.payload.message;
    }
});