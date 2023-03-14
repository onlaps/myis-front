import React, { createContext, useEffect, useState } from "react";
import { Button, Layout, Tabs } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Groups, Units, Reasons } from "./Tabs";
import Create from "./Create";

const { Content } = Layout;

export const Context = createContext();

const Screen = (props) => {
  const [activeKey, setActiveKey] = useState("1");
  const [adding, setAdding] = useState(false);
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
      label: "Группы товаров",
      children: <Groups />,
    },
    {
      key: "2",
      label: "Единицы",
      children: <Units />,
    },
    {
      key: "3",
      label: "Причины списаний",
      children: <Reasons />,
    },
  ];

  return (
    <Context.Provider
      value={{ adding, setAdding, activeKey, editing, setEditing }}
    >
      <Create />
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
          <Tabs onChange={onTabClick} activeKey={activeKey} items={items} />
        </Content>
      </Layout>
    </Context.Provider>
  );
};

export default Screen;
