import React, { useState, useRef } from "react";
import { Layout, Tabs, Button } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { FileExcelOutlined } from "@ant-design/icons";
import { Report } from "./Tabs";

const { Content } = Layout;

const Screen = (props) => {
  const [activeKey, setActiveKey] = useState("1");

  const ref = useRef();

  const onTabClick = (activeKey) => {
    setActiveKey(activeKey);
  };

  const items = [
    {
      key: "1",
      label: "Отчет",
      children: <Report ref={ref} />,
    },
  ];

  const onClick = () => {
    ref.current.export();
  };

  return (
    <Layout>
      <PageHeader
        title="Финансы"
        ghost={false}
        extra={[
          <Button type="primary" key="export" onClick={onClick}>
            <FileExcelOutlined />
            Скачать EXCEL
          </Button>,
        ]}
      />
      <Content className="main__content__layout">
        <Tabs onChange={onTabClick} activeKey={activeKey} items={items} />
      </Content>
    </Layout>
  );
};

export default Screen;
