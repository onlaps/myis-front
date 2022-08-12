import React, { createContext, useRef, useState } from "react";
import { Layout, Button, PageHeader, Table, DatePicker } from "antd";
import { Form, Select } from "antd";
import { columns } from "./data";
import Create from "./Create";
import History from "./History";
import Award from "./Award";

export const Context = createContext();
const { Content } = Layout;

const Screen = (props) => {
  const [adding, setAdding] = useState(false);
  const [history, setHistory] = useState(false);
  const [user, setUser] = useState(false);
  const form = useRef();
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(null);
  const [sorter, setSorter] = useState(null);

  const onChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilters(filters);
    setSorter({ [sorter.field]: sorter.order });
  };
  const options = {
    actions: {
      render: (_, item) => {
        return <div className="actions">123</div>;
      },
    },
    bonus: {
      render: (v) => {
        return (
          <Button size="small" type="link" onClick={() => setHistory(true)}>
            {v}
          </Button>
        );
      },
    },
    user: {
      render: (v, item) => {
        return (
          <Button size="small" type="link" onClick={() => setUser(item)}>
            {v}
          </Button>
        );
      },
    },
  };

  const onFinish = () => {};

  return (
    <>
      <Context.Provider
        value={{ adding, setAdding, history, setHistory, user, setUser }}
      >
        <Create />
        <History />
        <Award />
        <Layout>
          <PageHeader
            title="Расчет зарплаты"
            ghost={false}
            extra={[
              <Button
                key="create"
                type="primary"
                onClick={() => setAdding(true)}
              >
                Создать
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
              <Form.Item name="date">
                <DatePicker format="DD.MM.YYYY" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Поиск
                </Button>
              </Form.Item>
            </Form>
            <Table
              dataSource={[{ key: "1", bonus: 300, user: "Руслан" }]}
              columns={columns(options, filters, sorter)}
              onChange={onChange}
              pagination={pagination}
            />
          </Content>
        </Layout>
      </Context.Provider>
    </>
  );
};

export default Screen;
