import Immutable from "immutable";
import _ from "lodash";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  var newState, $var;
  switch (action.type) {
    case "SET_APP":
      newState = Immutable.fromJS(state).setIn(action.path, action.value);
      return newState.toJS();
    case "SET_APP_BY_PARAM":
      newState = Immutable.fromJS(state);
      if (action.param.length !== 2) return newState.toJS();
      const [name, value] = action.param;
      $var = newState.getIn(action.path).toJS();
      $var = _.findIndex($var, { [name]: value });
      if ($var === -1) return newState.toJS();
      Object.keys(action.value).forEach((key) => {
        newState = newState.setIn(
          [...action.path, $var, key],
          action.value[key]
        );
      });
      return newState.toJS();
    case "SET_APPS":
      newState = Immutable.fromJS(state);
      if (action.arr && action.arr.length !== 0) {
        action.arr.forEach((values) => {
          newState = newState.setIn(values.path, values.value);
        });
      }
      return newState.toJS();
    case "PUSH_APP":
      newState = Immutable.fromJS(state).updateIn(action.path, (data) =>
        data.push(action.value)
      );
      return newState.toJS();
    case "UNSHIFT_APP":
      newState = Immutable.fromJS(state).updateIn(action.path, (data) =>
        data.unshift(action.value)
      );
      return newState.toJS();
    case "REMOVE_APP_BY_PARAM":
      newState = Immutable.fromJS(state);
      $var = newState
        .getIn(action.path)
        .filter((o) => o.get(action.key) !== action.value);
      return newState.setIn(action.path, $var).toJS();
    case "INIT":
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};
