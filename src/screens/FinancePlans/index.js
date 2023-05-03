import React, { useState, createContext, useEffect } from "react";
import { Layout, Tabs, Button } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Plans, Statistic } from "./Tabs";
import Create from "./Create";
import useAccesses from "@/hooks/useAccesses";
import { isAllowed } from "@/utils";
import _ from "lodash";

const { Content } = Layout;

export const Context = createContext();

const Screen = (props) => {
  const accesses = useAccesses();
  const createAccesses = useAccesses(["create"]);
  const items = [];

  if (isAllowed("tariffs", accesses)) {
    items.push({
      key: "1",
      label: "Тарифы",
      children: <Plans />,
    });
  }
  if (isAllowed("tariffs_statistics", accesses)) {
    items.push({
      key: "2",
      label: "Статистика использования",
      children: <Statistic />,
    });
  }

  let key = null;

  if (items.length > 0) {
    key = _.last(items).key;
  }

  const [activeKey, setActiveKey] = useState(key);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);

  const onTabClick = (activeKey) => {
    setActiveKey(activeKey);
    setAdding(false);
  };

  const getExtra = () => {
    const extra = [];
    if (activeKey === "1" && isAllowed("tariffs", createAccesses)) {
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
    <Context.Provider
      value={{ adding, setAdding, editing, setEditing, activeKey }}
    >
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
