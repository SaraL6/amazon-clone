import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5001/clone-2d894/us-central1/api", // THE API URL
});

export default instance;
