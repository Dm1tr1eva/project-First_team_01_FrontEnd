import axios from "axios";

const browserApi = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export default browserApi;
