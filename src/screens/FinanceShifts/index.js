import React, { useState } from "react";
import { Layout, Tabs } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Shifts, Cash } from "./Tabs";

const { Content } = Layout;

const Screen = (props) => {
  const [activeKey, setActiveKey] = useState("1");

  const onTabClick = (activeKey) => {
    setActiveKey(activeKey);
  };

  const items = [
    {
      key: "1",
      label: "Смены",
      children: <Shifts />,
    },
    {
      key: "2",
      label: "Движение наличных",
      children: <Cash />,
    },
  ];

  return (
    <Layout>
      <PageHeader title="История смен" ghost={false} />
      <Content className="main__content__layout">
        <Tabs onChange={onTabClick} activeKey={activeKey} items={items} />
      </Content>
    </Layout>
  );
};

export default Screen;
