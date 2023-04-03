import React, { useState } from "react";
import { Layout, Tabs } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Report } from "./Tabs";

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
      children: <Report />,
    },
  ];

  return (
    <Layout>
      <PageHeader title="Финансы" ghost={false} />
      <Content className="main__content__layout">
        <Tabs onChange={onTabClick} activeKey={activeKey} items={items} />
      </Content>
    </Layout>
  );
};

export default Screen;
