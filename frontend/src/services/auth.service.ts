import axios from "axios";
import { API_BASE_URL } from "../common/constants";

const API_URL = API_BASE_URL + "/auth/";

const login = (username: string, password: string) => {
  return axios
    .post(API_URL + "login", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  let user = null;
  if (userStr) user = JSON.parse(userStr);
  return user;
};

const exportedObject = {
  login,
  logout,
  getCurrentUser,
};

export default exportedObject;
