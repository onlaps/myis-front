import { call } from "./axios";

export const SET_APP = (path, value) => ({ type: "SET_APP", path, value });
export const SET_APP_BY_PARAM = (path, param, value) => ({
  type: "SET_APP_BY_PARAM",
  path,
  param,
  value,
});
export const SET_APPS = (arr) => ({ type: "SET_APPS", arr });
export const PUSH_APP = (path, value) => ({
  type: "PUSH_APP",
  path,
  value,
});
export const UNSHIFT_APP = (path, value) => ({
  type: "UNSHIFT_APP",
  path,
  value,
});
export const REMOVE_APP_BY_PARAM = (path, key, value) => ({
  type: "REMOVE_APP_BY_PARAM",
  path,
  key,
  value,
});
