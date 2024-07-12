import { message } from "antd";
import axios from "axios";

const service = axios.create({
  timeout: 5000,
  baseURL: process.env.REACT_APP_BASE_URL,
});
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      message.error("请求超时, 请稍后再试");
    } else {
      message.error(error.message);
    }
    return Promise.reject(error);
  }
);
export default service;
