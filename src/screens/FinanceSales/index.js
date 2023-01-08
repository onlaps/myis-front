import React, { useRef, useState } from "react";
import { Layout, PageHeader } from "antd";
import { Table, Form, Select, Button, DatePicker } from "antd";
import { columns } from "./data";

const { Content } = Layout;

const Comp = () => {
  const [filters, setFilters] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [sorter, setSorter] = useState(null);

  const form = useRef();

  const onChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilters(filters);
    setSorter({ [sorter.field]: sorter.order });
  };

  const onFinish = () => {};

  const options = {};

  return (
    <Layout>
      <PageHeader title="История продаж" ghost={false} />
      <Content className="main__content__layout">
        <Form
          style={{ marginBottom: 16 }}
          ref={form}
          layout="inline"
          onFinish={onFinish}
        >
          <Form.Item name="place">
            <Select style={{ width: 200 }} placeholder="Все торговые точки">
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="item">
            <DatePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Поиск
            </Button>
          </Form.Item>
        </Form>
        <Table
          columns={columns(options, filters, sorter)}
          pagination={pagination}
          onChange={onChange}
        />
      </Content>
    </Layout>
  );
};

export default Comp;
