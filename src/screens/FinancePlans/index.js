import React, { useState, createContext, useEffect } from "react";
import { Layout, PageHeader, Tabs, Button } from "antd";
import { Plans, Statistic } from "./Tabs";
import Create from "./Create";

const { Content } = Layout;
const { TabPane } = Tabs;

export const Context = createContext();

const Screen = (props) => {
  const [adding, setAdding] = useState(false);
  const [activeKey, setActiveKey] = useState("1");
  const [editing, setEditing] = useState(null);

  const onTabClick = (activeKey) => {
    setActiveKey(activeKey);
    setAdding(false);
  };

  const getExtra = () => {
    const extra = [];
    if (activeKey === "1") {
      extra.push(
        <Button key="create" type="primary" onClick={() => setAdding(true)}>
          Создать
        </Button>
      );
    }
    return extra;
  };

  useEffect(() => {
    if (!adding) setEditing(null);
  }, [adding]);

  return (
    <Context.Provider value={{ adding, setAdding, editing, setEditing }}>
      <Create />
      <Layout>
        <PageHeader
          title="Тарифы оплаты времени"
          ghost={false}
          extra={getExtra()}
        />
        <Content className="main__content__layout">
          <Tabs onTabClick={onTabClick} activeKey={activeKey}>
            <TabPane tab="Тарифы" key="1">
              <Plans />
            </TabPane>
            <TabPane tab="Статистика использования" key="2">
              <Statistic />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Context.Provider>
  );
};

export default Screen;
