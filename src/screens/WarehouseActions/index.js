import React, { createContext, useRef, useState } from "react";
import { Layout, Button, PageHeader, Table } from "antd";
import { Form, Select, DatePicker } from "antd";
import { columns } from "./data";
import In from "./In";
import Out from "./Out";
import Move from "./Move";

const { RangePicker } = DatePicker;
const { Content } = Layout;

export const Context = createContext();

const Screen = (props) => {
  const form = useRef();
  const [filters, setFilters] = useState(null);
  const [sorter, setSorter] = useState(null);
  const [type, setType] = useState(null);

  const onChange = (pagination, filters, sorter) => {
    setFilters(filters);
    setSorter({ [sorter.field]: sorter.order });
  };
  const options = {
    actions: {
      render: (_, item) => {
        return <div className="actions">123</div>;
      },
    },
  };

  const onFinish = () => {};

  return (
    <Context.Provider value={{ type, setType }}>
      <In />
      <Out />
      <Move />
      <Layout>
        <PageHeader
          title="Движение товара"
          ghost={false}
          extra={[
            <Button key="income" type="primary" onClick={() => setType("in")}>
              Поступление
            </Button>,
            <Button
              key="outgoing"
              type="primary"
              onClick={() => setType("out")}
            >
              Списание
            </Button>,
            <Button key="move" type="primary" onClick={() => setType("move")}>
              Перемещение
            </Button>,
          ]}
        />
        <Content className="main__content__layout">
          <Form
            style={{ marginBottom: 16 }}
            ref={form}
            layout="inline"
            onFinish={onFinish}
          >
            <Form.Item name="place">
              <Select
                style={{ width: "100%" }}
                placeholder="Все торговые точки"
              >
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="date_period">
              <RangePicker format="DD.MM.YYYY" locale="ru" />
            </Form.Item>
            <Form.Item name="type">
              <Select
                style={{ width: "100%" }}
                placeholder="Выберите из списка"
              >
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="item">
              <Select
                style={{ width: "100%" }}
                placeholder="Выберите из списка"
              >
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Поиск
              </Button>
            </Form.Item>
          </Form>
          <Table
            columns={columns(options, filters, sorter)}
            onChange={onChange}
          />
        </Content>
      </Layout>
    </Context.Provider>
  );
};

export default Screen;
