import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

export const withAuth = (Item) => {
  const Component = (props) => {
    const user = useSelector((state) => state.app.user);

    if (!user) return <Navigate to="/login" />;

    return <Item {...props} />;
  };

  return <Component />;
};

export const authenticated = (Item) => {
  const Component = (props) => {
    const user = useSelector((state) => state.app.user);

    if (!user) return null;

    return <Item {...props} />;
  };

  return <Component />;
};
