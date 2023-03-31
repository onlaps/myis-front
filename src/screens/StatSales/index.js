import React, { useState, useRef } from "react";
import { Layout, Tabs, Select, Button } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Guests, Items, Types } from "./Tabs";
import { FileExcelOutlined } from "@ant-design/icons";
import _ from "lodash";

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
  const [selected, setSelected] = useState(options[0]);

  const gRef = useRef();
  const iRef = useRef();
  const tRef = useRef();

  const onTabClick = (activeKey) => {
    setActiveKey(activeKey);
  };

  const items = [
    {
      key: "1",
      label: "По часам",
      children: <Guests mode={selected} ref={gRef} />,
    },
    {
      key: "2",
      label: "По товарам",
      children: <Items mode={selected} ref={iRef} />,
    },
    {
      key: "3",
      label: "Тип оплаты",
      children: <Types mode={selected} ref={tRef} />,
    },
  ];

  const selectRender = () => {
    return (
      <Select
        value={selected._id}
        onChange={(_id) => setSelected(_.find(options, { _id }))}
      >
        {options.map((v) => (
          <Select.Option key={v._id} value={v._id}>
            {v.name}
          </Select.Option>
        ))}
      </Select>
    );
  };

  const onClick = () => {
    if (activeKey === "1") {
      gRef.current.export();
    } else if (activeKey === "2") {
      iRef.current.export();
    } else if (activeKey === "3") {
      tRef.current.export();
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Продажи"
        ghost={false}
        extra={[
          <Button type="primary" key="export" onClick={onClick}>
            <FileExcelOutlined />
            Скачать EXCEL
          </Button>,
        ]}
      />
      <Content className="main__content__layout">
        <Tabs
          onChange={onTabClick}
          activeKey={activeKey}
          items={items}
          tabBarExtraContent={selectRender()}
        />
      </Content>
    </Layout>
  );
};

export default Screen;
