import axios from "axios";

// Global-ஆக எல்லா requests-க்கும் credentials enable செய்கிறோம்
axios.defaults.withCredentials = true;

import {
  LOGIN_REQUEST, LOGIN_FAIL, LOGIN_SUCCESS, CLEAR_ERRORS,
  REGISTER_USER_FAIL, REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS,
  LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAIL,
  LOGOUT_SUCCESS, LOGOUT_FAIL,
  UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS, UPDATE_PROFILE_FAIL,
  UPDATE_PASSWORD_FAIL, UPDATE_PASSWORD_SUCCESS, UPDATE_PASSWORD_REQUEST,
  FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAIL,
  ALL_USERS_REQUEST, ALL_USERS_SUCCESS, ALL_USERS_FAIL,
  USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_DETAILS_FAIL,
  UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL,
  DELETE_USER_REQUEST, DELETE_USER_FAIL, DELETE_USER_SUCCESS,
} from "../constants/userConstanat";

const API_BASE = "https://cricketstore.onrender.com/api/v1";

// login user
export function login(email, password) {
  return async function (dispatch) {
    try {
      dispatch({ type: LOGIN_REQUEST });
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
      
      const { data } = await axios.post(`${API_BASE}/login`, { email, password }, config);

      sessionStorage.setItem("user", JSON.stringify(data.user));
      dispatch({ type: LOGIN_SUCCESS, payload: data.user });
    } catch (error) {
      dispatch({ type: LOGIN_FAIL, payload: error.response ? error.response.data.message : error.message });
    }
  };
}

// register user
export function signUp(signupData) {
  return async function (dispatch) {
    try {
      dispatch({ type: REGISTER_USER_REQUEST });
      // இங்கே withCredentials விடுபட்டிருந்தது, இப்போது சேர்க்கப்பட்டுள்ளது
      const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true };

      const { data } = await axios.post(`${API_BASE}/register`, signupData, config);

      sessionStorage.setItem("user", JSON.stringify(data.user));
      dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user });
    } catch (error) {
      dispatch({ type: REGISTER_USER_FAIL, payload: error.response ? error.response.data.message : error.message });
    }
  };
}

// Load User Profile
export const load_UserProfile = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });
    // எப்போதுமே சர்வரில் இருந்து லேட்டஸ்ட் டேட்டாவை எடுப்பது நல்லது
    const { data } = await axios.get(`${API_BASE}/profile`, { withCredentials: true });
    
    sessionStorage.setItem("user", JSON.stringify(data.user));
    dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: LOAD_USER_FAIL, payload: error.response ? error.response.data.message : error.message });
  }
};

// logout user 
export function logout() {
  return async function (dispatch) {
    try {
      await axios.get(`${API_BASE}/logout`, { withCredentials: true });
      sessionStorage.removeItem("user");
      dispatch({ type: LOGOUT_SUCCESS });
    } catch (error) {
      dispatch({ type: LOGOUT_FAIL, payload: error.response ? error.response.data.message : error.message });
    }
  };
}

// Update Profile
export function updateProfile(userData) {
  return async function (dispatch) {
    try {
      dispatch({ type: UPDATE_PROFILE_REQUEST });
      const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true };

      const { data } = await axios.put(`${API_BASE}/profile/update`, userData, config);

      // ப்ரொபைல் அப்டேட் ஆனதும் மீண்டும் லோட் செய்யவும்
      dispatch(load_UserProfile());

      dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data.success });
    } catch (error) {
      dispatch({ type: UPDATE_PROFILE_FAIL, payload: error.response ? error.response.data.message : error.message });
    }
  };
}

// Update Password
export function updatePassword(userPassWord) {
  return async function (dispatch) {
    try {
      dispatch({ type: UPDATE_PASSWORD_REQUEST });
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };

      const { data } = await axios.put(`${API_BASE}/password/update`, userPassWord, config);

      dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data.success });
    } catch (error) {
      dispatch({ type: UPDATE_PASSWORD_FAIL, payload: error.response ? error.response.data.message : error.message });
    }
  };
}

// forgetPassword
export function forgetPassword(email) {
  return async function (dispatch) {
    try {
      dispatch({ type: FORGOT_PASSWORD_REQUEST });
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };

      const { data } = await axios.post(`${API_BASE}/password/forgot`, email, config);

      dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });
    } catch (error) {
      dispatch({ type: FORGOT_PASSWORD_FAIL, payload: error.response ? error.response.data.message : error.message });
    }
  };
}

// reset password action
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });
    const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };

    const { data } = await axios.put(`${API_BASE}/password/reset/${token}`, passwords, config);

    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({ type: RESET_PASSWORD_FAIL, payload: error.response ? error.response.data.message : error.message });
  }
};

// Admin actions (All fixed with credentials)
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_USERS_REQUEST });
    const { data } = await axios.get(`${API_BASE}/admin/users`, { withCredentials: true });
    dispatch({ type: ALL_USERS_SUCCESS, payload: data.users });
  } catch (error) {
    dispatch({ type: ALL_USERS_FAIL, payload: error.response ? error.response.data.message : error.message });
  }
};

export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    const { data } = await axios.get(`${API_BASE}/admin/user/${id}`, { withCredentials: true });
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: USER_DETAILS_FAIL, payload: error.response ? error.response.data.message : error.message });
  }
};

export const updateUser = (id, userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });
    const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
    const { data } = await axios.put(`${API_BASE}/admin/user/${id}`, userData, config);
    dispatch({ type: UPDATE_USER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({ type: UPDATE_USER_FAIL, payload: error.response ? error.response.data.message : error.message });
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });
    const { data } = await axios.delete(`${API_BASE}/admin/user/${id}`, { withCredentials: true });
    dispatch({ type: DELETE_USER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({ type: DELETE_USER_FAIL, payload: error.response ? error.response.data.message : error.message });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};