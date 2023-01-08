import React, { useState, createContext, useEffect } from "react";
import { Layout, PageHeader, Tabs, Button } from "antd";
import { Checklists, Groups } from "./Tabs";
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
      <Create />
      <Layout>
        <PageHeader
          title="Чек-листы смен"
          ghost={false}
          extra={[
            <Button key="create" type="primary" onClick={() => setAdding(true)}>
              Создать
            </Button>,
          ]}
        />
        <Content className="main__content__layout">
          <Tabs onTabClick={onTabClick} activeKey={activeKey}>
            <TabPane tab="Чек-листы" key="1">
              <Checklists />
            </TabPane>
            <TabPane tab="Группы" key="2">
              <Groups />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Context.Provider>
  );
};

export default Screen;
