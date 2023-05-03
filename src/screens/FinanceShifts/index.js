import React, { useState } from "react";
import { Layout, Tabs } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Shifts, Cash } from "./Tabs";
import useAccesses from "@/hooks/useAccesses";
import { isAllowed } from "@/utils";
import _ from "lodash";

const { Content } = Layout;

const Screen = (props) => {
  const accesses = useAccesses();
  const items = [];

  if (isAllowed("shifts", accesses)) {
    items.push({
      key: "1",
      label: "Смены",
      children: <Shifts />,
    });
  }
  if (isAllowed("shift_cash", accesses)) {
    items.push({
      key: "2",
      label: "Движение наличных",
      children: <Cash />,
    });
  }

  let key = null;

  if (items.length > 0) {
    key = _.last(items).key;
  }

  const [activeKey, setActiveKey] = useState(key);

  const onTabClick = (activeKey) => {
    setActiveKey(activeKey);
  };

  return (
    <Layout>
      <PageHeader title="История смен" ghost={false} />
      <Content className="main__content__layout">
        <Tabs onChange={onTabClick} activeKey={activeKey} items={items} />
      </Content>
    </Layout>
  );
};

export default Screen;
