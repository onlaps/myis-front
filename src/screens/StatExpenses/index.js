import React, { useState } from "react";
import { Layout, Tabs } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Expense } from "./Tabs";

const { Content } = Layout;

const options = [
  {
    _id: "day",
    name: "По дням",
    format: "YYYY-MM-DD",
    date: "DD.MM",
    f: "%Y-%m-%d",
  },
  {
    _id: "week",
    name: "По неделям",
    format: "YYYY-WW",
    date: "WW",
    f: "%Y-%U",
  },
  {
    _id: "month",
    name: "По месяцам",
    format: "YYYY-MM",
    date: "MM.YYYY",
    f: "%Y-%m",
  },
];

const Screen = (props) => {
  const [activeKey, setActiveKey] = useState("1");

  const onTabClick = (activeKey) => {
    setActiveKey(activeKey);
  };

  const items = [
    {
      key: "1",
      label: "По месяцам",
      children: <Expense mode={options[0]} />,
    },
  ];

  return (
    <Layout>
      <PageHeader title="Расходы" ghost={false} />
      <Content className="main__content__layout">
        <Tabs onChange={onTabClick} activeKey={activeKey} items={items} />
      </Content>
    </Layout>
  );
};

export default Screen;
