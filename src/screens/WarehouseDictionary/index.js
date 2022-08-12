import React, { createContext, useState } from "react";
import { Button, Layout, PageHeader, Tabs } from "antd";
import { Groups, Units, Reasons } from "./Tabs";

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
        title="Справочники"
        ghost={false}
        extra={[
          <Button key="create" type="primary" onClick={() => setAdding(true)}>
            Создать
          </Button>,
        ]}
      />
      <Content className="main__content__layout">
        <Context.Provider value={{ adding, activeKey, setAdding }}>
          <Tabs onTabClick={onTabClick} activeKey={activeKey}>
            <TabPane tab="Группы товаров" key="1">
              <Groups />
            </TabPane>
            <TabPane tab="Единицы" key="2">
              <Units />
            </TabPane>
            <TabPane tab="Причины списаний" key="3">
              <Reasons />
            </TabPane>
          </Tabs>
        </Context.Provider>
      </Content>
    </Layout>
  );
};

export default Screen;
