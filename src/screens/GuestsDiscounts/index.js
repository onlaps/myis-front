import React, { useState, createContext, useEffect } from "react";
import { Layout, Tabs, Button } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Discounts, Promocodes } from "./Tabs";
import Create from "./Create";

export const Context = createContext();

const { Content } = Layout;

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

  const items = [
    {
      key: "1",
      label: "Скидки",
      children: <Discounts />,
    },
    {
      key: "2",
      label: "Промокоды",
      children: <Promocodes />,
    },
  ];

  return (
    <Context.Provider
      value={{ adding, setAdding, activeKey, editing, setEditing }}
    >
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
          <Tabs onChange={onTabClick} activeKey={activeKey} items={items} />
        </Content>
      </Layout>
    </Context.Provider>
  );
};

export default Screen;
