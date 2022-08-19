import React, { useState, createContext } from "react";
import { Layout, PageHeader, Tabs, Button } from "antd";
import { Discounts, Promocodes } from "./Tabs";
import Create from "./Create";

export const Context = createContext();

const { Content } = Layout;
const { TabPane } = Tabs;

const Screen = (props) => {
  const [activeKey, setActiveKey] = useState("1");
  const [adding, setAdding] = useState(false);
  const onTabClick = (activeKey) => {
    setActiveKey(activeKey);
  };

  return (
    <Context.Provider value={{ adding, setAdding, activeKey }}>
      <Create />
      <Layout>
        <PageHeader
          title="Скидки"
          ghost={false}
          extra={[
            <Button key="create" type="primary" onClick={() => setAdding(true)}>
              Создать
            </Button>,
          ]}
        />
        <Content className="main__content__layout">
          <Tabs onTabClick={onTabClick} activeKey={activeKey}>
            <TabPane tab="Скидки" key="1">
              <Discounts />
            </TabPane>
            <TabPane tab="Промокоды" key="2">
              <Promocodes />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Context.Provider>
  );
};

export default Screen;
