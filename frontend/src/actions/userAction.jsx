import axios from "axios";

// Global-ஆக எல்லா requests-க்கும் credentials enable செய்கிறோம்
axios.defaults.withCredentials = true;

import {
  LOGIN_REQUEST,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  CLEAR_ERRORS,
  REGISTER_USER_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PASSWORD_FAIL,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_REQUEST,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  ALL_USERS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  UPDATE_USER_REQUEST,
  USER_DETAILS_FAIL,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_FAIL,
  DELETE_USER_SUCCESS,
} from "../constants/userConstanat";

// Base URL (மாற்றுவது எளிது என்பதால் ஒரு மாறியில் வைப்பது நல்லது)
const API_BASE_URL = "https://cricketstore.onrender.com/api/v1";

// Login User
export function login(email, password) {
  return async function (dispatch) {
    try {
      dispatch({ type: LOGIN_REQUEST });

      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };
      
      const { data } = await axios.post(
        `${API_BASE_URL}/login`,
        { email, password },
        config
      );

      dispatch({ type: LOGIN_SUCCESS, payload: data.user });
    } catch (error) {
      dispatch({ 
        type: LOGIN_FAIL, 
        payload: error.response ? error.response.data.message : error.message 
      });
    }
  };
}

// Register User
export function signUp(signupData) {
  return async function (dispatch) {
    try {
      dispatch({ type: REGISTER_USER_REQUEST });
      
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      };

      const { data } = await axios.post(
        `${API_BASE_URL}/register`,
        signupData,
        config
      );

      dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user });
    } catch (error) {
      dispatch({ 
        type: REGISTER_USER_FAIL, 
        payload: error.response ? error.response.data.message : error.message 
      });
    }
  };
}

// Load User Profile
export const load_UserProfile = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    // Session storage-ல் டேட்டா இருக்கிறதா என்று பார்ப்போம்
    const userData = sessionStorage.getItem("user");
    
    if (userData && userData !== "undefined") {
      const user = JSON.parse(userData);
      dispatch({ type: LOAD_USER_SUCCESS, payload: user });
    } else {
      // Backend call - withCredentials முக்கியம்
      const { data } = await axios.get(`${API_BASE_URL}/profile`, { withCredentials: true });
      
      dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
      sessionStorage.setItem("user", JSON.stringify(data.user));
    }
  } catch (error) {
    dispatch({ 
      type: LOAD_USER_FAIL, 
      payload: error.response ? error.response.data.message : error.message 
    });
  }
};

// Logout User
export function logout() {
  return async function (dispatch) {
    try {
      await axios.get(`${API_BASE_URL}/logout`, { withCredentials: true });
      
      sessionStorage.removeItem("user");
      dispatch({ type: LOGOUT_SUCCESS });
    } catch (error) {
      dispatch({ 
        type: LOGOUT_FAIL, 
        payload: error.response ? error.response.data.message : error.message 
      });
    }
  };
}

// Update Profile
export function updateProfile(userData) {
  return async function (dispatch) {
    try {
      dispatch({ type: UPDATE_PROFILE_REQUEST });

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      };

      const { data } = await axios.put(
        `${API_BASE_URL}/profile/update`,
        userData,
        config
      );

      if (data.user) {
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      dispatch({
        type: UPDATE_PROFILE_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      dispatch({ 
        type: UPDATE_PROFILE_FAIL, 
        payload: error.response ? error.response.data.message : error.message 
      });
    }
  };
}

// Update Password
export function updatePassword(userPassWord) {
  return async function (dispatch) {
    try {
      dispatch({ type: UPDATE_PASSWORD_REQUEST });

      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // பாதுகாப்பான மாற்றங்களுக்கு இது அவசியம்
      };

      const { data } = await axios.put(
        `${API_BASE_URL}/password/update`,
        userPassWord,
        config
      );

      dispatch({
        type: UPDATE_PASSWORD_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      dispatch({ 
        type: UPDATE_PASSWORD_FAIL, 
        payload: error.response ? error.response.data.message : error.message 
      });
    }
  };
}

// Forgot Password
export function forgetPassword(email) {
  return async function (dispatch) {
    try {
      dispatch({ type: FORGOT_PASSWORD_REQUEST });

      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      const { data } = await axios.post(
        `${API_BASE_URL}/password/forgot`,
        email,
        config
      );

      dispatch({
        type: FORGOT_PASSWORD_SUCCESS,
        payload: data.message,
      });
    } catch (error) {
      dispatch({ 
        type: FORGOT_PASSWORD_FAIL, 
        payload: error.response ? error.response.data.message : error.message 
      });
    }
  };
}

// Reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });

    const config = { 
      headers: { "Content-Type": "application/json" },
      withCredentials: true 
    };

    const { data } = await axios.put(
      `${API_BASE_URL}/password/reset/${token}`,
      passwords,
      config
    );

    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

// Admin Actions -----------------------------------------------------------

// Get All Users (Admin)
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_USERS_REQUEST });

    const { data } = await axios.get(`${API_BASE_URL}/admin/users`, { withCredentials: true });

    dispatch({ type: ALL_USERS_SUCCESS, payload: data.users });
  } catch (error) {
    dispatch({ 
      type: ALL_USERS_FAIL, 
      payload: error.response ? error.response.data.message : error.message 
    });
  }
};

// Get User Details (Admin)
export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    
    const { data } = await axios.get(`${API_BASE_URL}/admin/user/${id}`, { withCredentials: true });
    
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ 
      type: USER_DETAILS_FAIL, 
      payload: error.response ? error.response.data.message : error.message 
    });
  }
};

// Update User Role (Admin)
export const updateUser = (id, userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.put(
      `${API_BASE_URL}/admin/user/${id}`,
      userData,
      config
    );

    dispatch({ type: UPDATE_USER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({ 
      type: UPDATE_USER_FAIL, 
      payload: error.response ? error.response.data.message : error.message 
    });
  }
};

// Delete User (Admin)
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });

    const { data } = await axios.delete(`${API_BASE_URL}/admin/user/${id}`, { withCredentials: true });

    dispatch({ type: DELETE_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ 
      type: DELETE_USER_FAIL, 
      payload: error.response ? error.response.data.message : error.message 
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};