import React, { createContext, useState } from "react";
import { Button, Layout, PageHeader, Tabs } from "antd";
import { Shifts, Employees } from "./Tabs";
import Create from "./Create";

const { Content } = Layout;
const { TabPane } = Tabs;

export const Context = createContext();

const Screen = (props) => {
  const [activeKey, setActiveKey] = useState("1");
  const [adding, setAdding] = useState(false);

  const onTabClick = (activeKey) => {
    setActiveKey(activeKey);
    setAdding(false);
  };

  return (
    <Layout>
      <PageHeader
        title="График работы"
        ghost={false}
        extra={[
          <Button key="create" type="primary" onClick={() => setAdding(true)}>
            Создать смену
          </Button>,
        ]}
      />
      <Content className="main__content__layout">
        <Context.Provider value={{ adding, activeKey, setAdding }}>
          <Create />
          <Tabs onTabClick={onTabClick} activeKey={activeKey}>
            <TabPane tab="По сменам" key="1">
              <Shifts />
            </TabPane>
            <TabPane tab="По сотрудникам" key="2">
              <Employees />
            </TabPane>
          </Tabs>
        </Context.Provider>
      </Content>
    </Layout>
  );
};

export default Screen;
