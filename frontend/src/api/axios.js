import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const API = axios.create({
  baseURL: `${BACKEND_URL}api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
