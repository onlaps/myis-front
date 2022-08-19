import React, { useRef, useState } from "react";
import { Table, Form, Select, Button, DatePicker } from "antd";
import { columns } from "./data";

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
    <>
      <Form
        style={{ marginBottom: 16 }}
        ref={form}
        layout="inline"
        onFinish={onFinish}
      >
        <Form.Item name="place">
          <Select style={{ width: "100%" }} placeholder="Все торговые точки">
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="date">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item name="category">
          <Select style={{ width: "100%" }} placeholder="Выберите из списка">
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="type">
          <Select style={{ width: "100%" }} placeholder="Выберите из списка">
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
        pagination={pagination}
        onChange={onChange}
      />
    </>
  );
};

export default Comp;
