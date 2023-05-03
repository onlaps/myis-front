import { useLocation } from "react-router";
import { useEffect } from "react";
import { Sider } from "../ui";
import { useState } from "react";

const useRouteAccess = () => {
  const [item, setItem] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let changed = false;
    const mapper = (array, changed) => {
      for (let i = 0; i < array.length; i++) {
        const o = array[i];
        if (changed) return;
        if (o.key === location.pathname) {
          setItem(o);
          changed = true;
          return;
        } else if (o.children) {
          mapper(o.children, changed);
        }
      }
    };
    mapper(Sider.items, changed);
  }, [location.pathname]);

  return item;
};

export default useRouteAccess;
