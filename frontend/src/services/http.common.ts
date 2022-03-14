import axios from "axios";
import authHeader from "./auth.header";
import { API_BASE_URL } from "../common/constants";

export default axios.create({
  baseURL: API_BASE_URL,
  headers: authHeader(),
});
