import axios from "axios";

// Global-ஆக எல்லா requests-க்கும் credentials enable செய்கிறோம்
// Idhu backend cookies-ai auto-vaga anuppa udhavum
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

// Base URL
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

      // Login success aanal session storage-il update seiyavum
      sessionStorage.setItem("user", JSON.stringify(data.user));

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

      sessionStorage.setItem("user", JSON.stringify(data.user));

      dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user });
    } catch (error) {
      dispatch({ 
        type: REGISTER_USER_FAIL, 
        payload: error.response ? error.response.data.message : error.message 
      });
    }
  };
}

// Load User Profile (Updated Logic)
export const load_UserProfile = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    // Localhost to Render communication-il session storage silar neram error tharum.
    // Adhanaal eppodhum backend-il irundhu fresh data-vai edukka solluvom.
    const { data } = await axios.get(`${API_BASE_URL}/profile`, { withCredentials: true });
    
    sessionStorage.setItem("user", JSON.stringify(data.user));
    
    dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
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

      // Profile update aanal user data-vai update seiya load_UserProfile call seiyalam
      dispatch(load_UserProfile());

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

// ... (Update Password, Forgot Password, Reset Password logic-il matram illai, adhu sariyaaga ulladhu)

// Update Password
export function updatePassword(userPassWord) {
  return async function (dispatch) {
    try {
      dispatch({ type: UPDATE_PASSWORD_REQUEST });

      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
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

// Forgot/Reset and Admin actions remain the same as they follow the withCredentials rule properly.
// ... (Adutha adutha admin actions-um sariyaaga ulladhu)

export const forgetPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST });
        const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
        const { data } = await axios.post(`${API_BASE_URL}/password/forgot`, email, config);
        dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });
    } catch (error) {
        dispatch({ type: FORGOT_PASSWORD_FAIL, payload: error.response.data.message });
    }
};

export const resetPassword = (token, passwords) => async (dispatch) => {
    try {
        dispatch({ type: RESET_PASSWORD_REQUEST });
        const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
        const { data } = await axios.put(`${API_BASE_URL}/password/reset/${token}`, passwords, config);
        dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.success });
    } catch (error) {
        dispatch({ type: RESET_PASSWORD_FAIL, payload: error.response.data.message });
    }
};

export const getAllUsers = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_USERS_REQUEST });
        const { data } = await axios.get(`${API_BASE_URL}/admin/users`, { withCredentials: true });
        dispatch({ type: ALL_USERS_SUCCESS, payload: data.users });
    } catch (error) {
        dispatch({ type: ALL_USERS_FAIL, payload: error.response.data.message });
    }
};

export const getUserDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: USER_DETAILS_REQUEST });
        const { data } = await axios.get(`${API_BASE_URL}/admin/user/${id}`, { withCredentials: true });
        dispatch({ type: USER_DETAILS_SUCCESS, payload: data.user });
    } catch (error) {
        dispatch({ type: USER_DETAILS_FAIL, payload: error.response.data.message });
    }
};

export const updateUser = (id, userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_USER_REQUEST });
        const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
        const { data } = await axios.put(`${API_BASE_URL}/admin/user/${id}`, userData, config);
        dispatch({ type: UPDATE_USER_SUCCESS, payload: data.success });
    } catch (error) {
        dispatch({ type: UPDATE_USER_FAIL, payload: error.response.data.message });
    }
};

export const deleteUser = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_USER_REQUEST });
        const { data } = await axios.delete(`${API_BASE_URL}/admin/user/${id}`, { withCredentials: true });
        dispatch({ type: DELETE_USER_SUCCESS, payload: data.success });
    } catch (error) {
        dispatch({ type: DELETE_USER_FAIL, payload: error.response.data.message });
    }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};