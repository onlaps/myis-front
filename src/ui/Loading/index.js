import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import "./index.less";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Loading = () => (
  <div className="app__overlay">
    <div className="app__loading">{<Spin indicator={antIcon} />}</div>
  </div>
);

export default Loading;
