import React, { useState, createContext } from "react";
import { Layout, Tabs, Button } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Salaries, Plans } from "./Tabs";
import Create from "./Create";
import { useEffect } from "react";
import useAccesses from "@/hooks/useAccesses";
import { isAllowed } from "@/utils";
import _ from "lodash";

const { Content } = Layout;

export const Context = createContext();

const Screen = (props) => {
  const accesses = useAccesses();
  const createAccesses = useAccesses(["create"]);
  const items = [];

  if (isAllowed("team_salary", accesses)) {
    items.push({
      key: "1",
      label: "Ставки по зарплате",
      children: <Salaries />,
    });
  }
  if (isAllowed("team_salary_plans", accesses)) {
    items.push({
      key: "2",
      label: "Планы по премиям",
      children: <Plans />,
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

  useEffect(() => {
    if (!adding) setEditing(null);
  }, [adding]);

  const extra = [];

  if (
    isAllowed("team_salary", createAccesses) ||
    isAllowed("team_salary_plans", createAccesses)
  ) {
    extra.push(
      <Button key="create" type="primary" onClick={() => setAdding(true)}>
        Создать
      </Button>
    );
  }

  return (
    <Context.Provider
      value={{ adding, setAdding, activeKey, editing, setEditing }}
    >
      <Create />
      <Layout>
        <PageHeader title="Зарплаты и планы" ghost={false} extra={extra} />
        <Content className="main__content__layout">
          <Tabs onChange={onTabClick} activeKey={activeKey} items={items} />
        </Content>
      </Layout>
    </Context.Provider>
  );
};

export default Screen;
