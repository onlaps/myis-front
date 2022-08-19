import React, { useState, createContext } from "react";
import { Layout, PageHeader, Tabs, Button } from "antd";
import { Expenses, Categories } from "./Tabs";
import Create from "./Create";

const { Content } = Layout;
const { TabPane } = Tabs;

export const Context = createContext();

const Screen = (props) => {
  const [adding, setAdding] = useState(false);
  const [activeKey, setActiveKey] = useState("1");

  const onTabClick = (activeKey) => {
    setActiveKey(activeKey);
    setAdding(false);
  };

  return (
    <Context.Provider value={{ adding, setAdding, activeKey }}>
      <Create />
      <Layout>
        <PageHeader
          title="Расходы"
          ghost={false}
          extra={[
            <Button key="create" type="primary" onClick={() => setAdding(true)}>
              Создать
            </Button>,
          ]}
        />
        <Content className="main__content__layout">
          <Tabs onTabClick={onTabClick} activeKey={activeKey}>
            <TabPane tab="Расходы" key="1">
              <Expenses />
            </TabPane>
            <TabPane tab="Категория расходов" key="2">
              <Categories />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Context.Provider>
  );
};

export default Screen;
