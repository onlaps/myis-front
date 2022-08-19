import AXIOS from "axios";
import { notification } from "antd";
import { LOGOUT } from "./app";

export const axios = AXIOS.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

axios.interceptors.response.use(
  (response) => response,
  (e) => {
    const status = e?.response?.status;
    if (status) {
      if (status === 401) LOGOUT();
      else if (status === 500) {
        const values = {
          message: "Ошибка",
          description: "Неизвестная ошибка",
        };
        const message = e?.response?.data?.message;
        if (message) values.description = message;
        notification.error(values);
      }
    }
  }
);

export const call = (params) => {
  return (dispatch, getState) => {
    const { token } = getState().app;
    if (!params.headers) params.headers = {};
    if (token) params.headers.Authorization = `Bearer ${token}`;

    return axios(params);
  };
};
