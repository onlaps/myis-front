import React, { useState, createContext, useEffect } from "react";
import { Layout, Tabs, Button } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { List, Sources, Statistic } from "./Tabs";
import Create from "./Create";
import useAccesses from "@/hooks/useAccesses";
import { isAllowed } from "@/utils";
import _ from "lodash";

export const Context = createContext();

const { Content } = Layout;

const Screen = (props) => {
  const accesses = useAccesses();
  const createAccesses = useAccesses(["create"]);
  const items = [];

  if (isAllowed("guest_card", accesses)) {
    items.push({
      key: "1",
      label: "Список",
      children: <List />,
    });
  }
  if (isAllowed("guest_card_sources", accesses)) {
    items.push({
      key: "2",
      label: "Источники",
      children: <Sources />,
    });
  }
  if (isAllowed("guest_card_statistic", accesses)) {
    items.push({
      key: "3",
      label: "Статистика",
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
  };

  useEffect(() => {
    if (!adding) setEditing(null);
  }, [adding]);

  const extra = [];

  if (activeKey !== "3") {
    if (
      isAllowed("guest_card", createAccesses) ||
      isAllowed("guest_card_sources", createAccesses)
    ) {
      extra.push(
        <Button key="create" type="primary" onClick={() => setAdding(true)}>
          Создать
        </Button>
      );
    }
  }

  return (
    <Context.Provider
      value={{ adding, setAdding, activeKey, editing, setEditing }}
    >
      <Layout>
        <Create />
        <PageHeader title="Карта гостя" ghost={false} extra={extra} />
        <Content className="main__content__layout">
          <Tabs onChange={onTabClick} activeKey={activeKey} items={items} />
        </Content>
      </Layout>
    </Context.Provider>
  );
};

export default Screen;
