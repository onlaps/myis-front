import React from "react";
import { Layout } from "antd";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";
import { isMobile } from "react-device-detect";
import { Sider } from "./ui";
import classNames from "classnames";
import useAccesses from "@/hooks/useAccesses";
import useRouteAccess from "@/hooks/useRouteAccess";
import _ from "lodash";

export const withAuth = (Item) => {
  const Component = (props) => {
    const user = useSelector((state) => state.app.user);
    const collapsed = useSelector((state) => state.app.collapsed);
    const location = useLocation();

    const path = location.pathname.split("/");
    const isCashier = path.indexOf("cashier") !== -1;

    const accesses = useAccesses();
    const route = useRouteAccess();

    const authenticated = () => {
      if (isCashier || isMobile) return null;
      return <Sider />;
    };

    if (!user) return <Navigate to="/login" />;

    if (route) {
      if (
        route.accesses &&
        _.intersection(route.accesses, accesses).length === 0
      ) {
        if (location.pathname === "/") {
          return <Navigate to={window.defaultPath} />;
        }
        return <Navigate to="/no-access" />;
      }
    }

    if (isMobile && path.indexOf("mobile") === -1) {
      return <Navigate to="/mobile" />;
    } else if (!isMobile && path.indexOf("mobile") !== -1) {
      return <Navigate to="/" />;
    }

    return (
      <Layout
        className={classNames({
          main__wrapper: true,
          "no-margin": isCashier || isMobile,
          "sm-margin": collapsed,
        })}
      >
        {authenticated()}
        <Layout>
          <Item {...props} />
        </Layout>
      </Layout>
    );
  };

  return <Component />;
};
