import { SET_APP } from "./app";
import { call } from "./axios";

export const GET_PLACES = () => async (dispatch) => {
  const { data } = await dispatch(call({ url: `places` }));
  dispatch(SET_APP(["places"], data));
};
