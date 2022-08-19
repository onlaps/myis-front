import React, { useState } from "react";
import { Layout, PageHeader, Tabs } from "antd";
import { Shifts, Cash } from "./Tabs";

const { Content } = Layout;
const { TabPane } = Tabs;

const Screen = (props) => {
  const [activeKey, setActiveKey] = useState("1");

  const onTabClick = (activeKey) => {
    setActiveKey(activeKey);
  };

  return (
    <Layout>
      <PageHeader title="История смен" ghost={false} />
      <Content className="main__content__layout">
        <Tabs onTabClick={onTabClick} activeKey={activeKey}>
          <TabPane tab="Смены" key="1">
            <Shifts />
          </TabPane>
          <TabPane tab="Движение наличных" key="2">
            <Cash />
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default Screen;
