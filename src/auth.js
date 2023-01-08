import React from "react";
import { Layout } from "antd";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";
import { Sider } from "./ui";
import classNames from "classnames";

export const withAuth = (Item) => {
  const Component = (props) => {
    const user = useSelector((state) => state.app.user);
    const location = useLocation();

    const path = location.pathname.split("/");
    const isCashier = path.indexOf("cashier") !== -1;

    const authenticated = () => {
      if (isCashier) return null;
      return <Sider />;
    };

    if (!user) return <Navigate to="/login" />;

    return (
      <Layout
        className={classNames({ main__wrapper: true, "no-margin": isCashier })}
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
