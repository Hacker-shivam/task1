import axios from "axios";

const API = axios.create({
  baseURL: "https://task1-9a34.onrender.com/api"
});

export default API;