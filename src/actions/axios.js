import AXIOS from "axios";

export const axios = AXIOS.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export const call = (params) => {
  return (dispatch, getState) => {
    const { token } = getState().app;
    if (!params.headers) params.headers = {};
    if (token) params.headers.Authorization = `Bearer ${token}`;

    return axios(params);
  };
};
