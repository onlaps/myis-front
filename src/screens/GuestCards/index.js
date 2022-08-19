import React, { useState, createContext, useEffect } from "react";
import { Layout, PageHeader, Tabs, Button } from "antd";
import { List, Sources, Statistic } from "./Tabs";
import Create from "./Create";

export const Context = createContext();

const { Content } = Layout;
const { TabPane } = Tabs;

const Screen = (props) => {
  const [activeKey, setActiveKey] = useState("1");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const onTabClick = (activeKey) => {
    setActiveKey(activeKey);
  };

  useEffect(() => {
    if (!adding) setEditing(null);
  }, [adding]);

  return (
    <Context.Provider
      value={{ adding, setAdding, activeKey, editing, setEditing }}
    >
      <Layout>
        <Create />
        <PageHeader
          title="Карта гостя"
          ghost={false}
          extra={
            activeKey === "3" || [
              <Button
                key="create"
                type="primary"
                onClick={() => setAdding(true)}
              >
                Создать
              </Button>,
            ]
          }
        />
        <Content className="main__content__layout">
          <Tabs onTabClick={onTabClick} activeKey={activeKey}>
            <TabPane tab="Список" key="1">
              <List />
            </TabPane>
            <TabPane tab="Источники" key="2">
              <Sources />
            </TabPane>
            <TabPane tab="Статистика" key="3">
              <Statistic />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Context.Provider>
  );
};

export default Screen;
