import React, { useState, createContext, useEffect } from "react";
import { Layout, Tabs, Button } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Plans, Statistic } from "./Tabs";
import Create from "./Create";

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

  const items = [
    {
      key: "1",
      label: "Тарифы",
      children: <Plans />,
    },
    {
      key: "2",
      label: "Статистика использования",
      children: <Statistic />,
    },
  ];

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
          <Tabs onChange={onTabClick} activeKey={activeKey} items={items} />
        </Content>
      </Layout>
    </Context.Provider>
  );
};

export default Screen;
