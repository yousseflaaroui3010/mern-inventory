import axios from 'axios'
import { returnErrors } from "./errorActions";

import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from './types'

export const loadUser = () => dispatch => {
  dispatch({ type: USER_LOADING })

  axios.get('/api/users/user')
    .then(res => {
      console.log("User loaded:", res.data);
      dispatch({
        type: USER_LOADED,
        payload: res.data
      })
    })
    .catch(err => {
      console.error("Error loading user:", err.response ? err.response.data : err.message);
      dispatch(returnErrors(err.response ? err.response.data : err.message));
      dispatch({
        type: AUTH_ERROR
      })
    })
}

export const login = ({ email, password }) => dispatch => {
  console.log("Login attempt with:", email);
  
  // Request body
  const body = JSON.stringify({ email, password });
  
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  axios.post('/api/users/login', { email, password }, config)
    .then(res => {
      console.log("Login successful:", res.data);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      })
    })
    .catch(err => {
      console.error("Login failed:", err.response ? err.response.data : err.message);
      dispatch(returnErrors(err.response ? err.response.data : err.message));
      dispatch({
        type: LOGIN_FAIL
      })
    })
}

export const logout = () => dispatch => {
  console.log("Logging out...");
  
  axios.post('/api/users/logout')
    .then(() => {
      console.log("Logout successful");
      dispatch({
        type: LOGOUT_SUCCESS
      })
    })
    .catch(err => {
      console.error("Logout error:", err.response ? err.response.data : err.message);
    })
}

export const register = ({ username, email, password }) => dispatch => {
  console.log("Registration attempt for:", email);
  
  // Request body
  const body = JSON.stringify({ username, email, password });
  
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  axios.post('/api/users/register', { username, email, password }, config)
    .then(res => {
      console.log("Registration successful:", res.data);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      })
    })
    .catch(err => {
      console.error("Registration failed:", err.response ? err.response.data : err.message);
      dispatch(returnErrors(err.response ? err.response.data : err.message));
      dispatch({
        type: REGISTER_FAIL
      })
    })
}