import React, { useState, createContext } from "react";
import { Layout, Tabs, Button } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Salaries, Plans } from "./Tabs";
import Create from "./Create";
import { useEffect } from "react";

const { Content } = Layout;

export const Context = createContext();

const Screen = (props) => {
  const [adding, setAdding] = useState(false);
  const [activeKey, setActiveKey] = useState("1");
  const [editing, setEditing] = useState(null);

  const onTabClick = (activeKey) => {
    setActiveKey(activeKey);
    setAdding(false);
  };

  useEffect(() => {
    if (!adding) setEditing(null);
  }, [adding]);

  const items = [
    {
      key: "1",
      label: "Ставки по зарплате",
      children: <Salaries />,
    },
    {
      key: "2",
      label: "Планы по премиям",
      children: <Plans />,
    },
  ];

  return (
    <Context.Provider
      value={{ adding, setAdding, activeKey, editing, setEditing }}
    >
      <Create />
      <Layout>
        <PageHeader
          title="Зарплаты и планы"
          ghost={false}
          extra={[
            <Button key="create" type="primary" onClick={() => setAdding(true)}>
              Создать
            </Button>,
          ]}
        />
        <Content className="main__content__layout">
          <Tabs onChange={onTabClick} activeKey={activeKey} items={items} />
        </Content>
      </Layout>
    </Context.Provider>
  );
};

export default Screen;
