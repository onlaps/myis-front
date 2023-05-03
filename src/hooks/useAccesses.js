import { useSelector } from "react-redux";
import _ from "lodash";

const useAccesses = (types = ["view", "full"]) => {
  const user = useSelector((state) => state.app.user);

  const accesses = _.filter(
    user?.role?.accesses,
    (o) => types.indexOf(o.action_type) !== -1
  ).map((a) => a.type);

  return accesses;
};

export default useAccesses;
