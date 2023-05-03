import React, { createContext, useEffect, useState } from "react";
import { Button, Layout, Tabs } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Groups, Units, Reasons } from "./Tabs";
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

  if (isAllowed("wh_categories", accesses)) {
    items.push({
      key: "1",
      label: "Группы товаров",
      children: <Groups />,
    });
  }
  if (isAllowed("wh_units", accesses)) {
    items.push({
      key: "2",
      label: "Единицы",
      children: <Units />,
    });
  }
  if (isAllowed("wh_reasons", accesses)) {
    items.push({
      key: "3",
      label: "Причины списаний",
      children: <Reasons />,
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
    isAllowed("wh_categories", createAccesses) ||
    isAllowed("wh_units", createAccesses) ||
    isAllowed("wh_reasons", createAccesses)
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
        <PageHeader title="Справочники" ghost={false} extra={extra} />
        <Content className="main__content__layout">
          <Tabs onChange={onTabClick} activeKey={activeKey} items={items} />
        </Content>
      </Layout>
    </Context.Provider>
  );
};

export default Screen;
