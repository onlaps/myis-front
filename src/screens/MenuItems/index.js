import React, { createContext, useEffect, useRef, useState } from "react";
import _ from "lodash";
import { Layout, Button, PageHeader, Table } from "antd";
import { Dropdown, Menu, Modal } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Form, Select } from "antd";
import { columns } from "./data";
import { call } from "@/actions/axios";
import queryString from "query-string";
import { SET_APP } from "@/actions/app";
import Create from "./Create";
import { useDispatch, useSelector } from "react-redux";

export const Context = createContext();
const { Content } = Layout;
const { confirm } = Modal;

const Screen = (props) => {
  const [adding, setAdding] = useState(false);
  const [history, setHistory] = useState(false);
  const form = useRef();
  const [filters, setFilters] = useState(null);
  const [sorter, setSorter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const onChange = (pagination, filters, sorter) => {
    setFilters(filters);
    setSorter({ [sorter.field]: sorter.order });
  };

  const dispatch = useDispatch();

  const places = useSelector((state) => state.app.places || []);
  const menu_items = useSelector((state) => state.app.menu_items || []);
  const menu_categories = useSelector(
    (state) => state.app.menu_categories || []
  );

  useEffect(() => {
    getPlaces();
    getCategories();
    getWhItems();
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
      const query = queryString.stringify(values);
      const { data } = await dispatch(call({ url: `menu_items?${query}` }));
      dispatch(SET_APP(["menu_items"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getWhItems = async () => {
    try {
      const { data } = await dispatch(call({ url: "wh_items" }));
      dispatch(SET_APP(["wh_items"], data));
    } catch (e) {}
  };

  const getPlaces = async () => {
    try {
      const { data } = await dispatch(call({ url: `places` }));
      dispatch(SET_APP(["places"], data));
    } catch (e) {}
  };

  const getCategories = async () => {
    try {
      const { data } = await dispatch(call({ url: `menu_categories` }));
      dispatch(SET_APP(["menu_categories"], data));
    } catch (e) {}
  };

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await dispatch(call({ url: `menu_items/${id}`, method: "DELETE" }));
      await getData();
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onClick = (item) => (e) => {
    if (e.key === "1") {
      setEditing(item);
      setAdding(true);
    } else {
      confirm({
        title: "Вы уверены?",
        icon: <ExclamationCircleOutlined />,
        content: "Данное действие невозможно отменить!",
        onOk() {
          onDelete(item._id);
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    }
  };

  const menu = (item) => (
    <Menu
      onClick={onClick(item)}
      items={[
        {
          key: "1",
          label: "Редактировать",
        },
        {
          key: "2",
          label: "Удалить",
        },
      ]}
    />
  );

  const options = {
    actions: {
      render: (_, item) => {
        return (
          <Dropdown overlay={menu(item)}>
            <EllipsisOutlined />
          </Dropdown>
        );
      },
    },
    cost_price: {
      render: (val, item) => {
        if (item.wh_item_prices.length === 0) return null;
        return _.meanBy(item.wh_item_prices, "price");
      },
    },
    margin: {
      render: (val, item) => {
        if (item.wh_item_prices.length === 0) return null;
        return item.price - _.meanBy(item.wh_item_prices, "price");
      },
    },
    margin_percent: {
      render: (val, item) => {
        if (item.wh_item_prices.length === 0) return null;
        const cost_price = _.meanBy(item.wh_item_prices, "price");
        return Math.round(((item.price - cost_price) / cost_price) * 100) + "%";
      },
    },
  };

  const onFinish = () => {
    getData();
  };

  return (
    <>
      <Context.Provider
        value={{ adding, setAdding, history, setHistory, editing, setEditing }}
      >
        <Create />
        <Layout>
          <PageHeader
            title="Пункты меню"
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
                  style={{ width: 200 }}
                  placeholder="Все торговые точки"
                  allowClear
                >
                  {places.map((v) => (
                    <Select.Option key={v._id} value={v._id}>
                      {v.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="menu_category">
                <Select
                  style={{ width: 200 }}
                  placeholder="Выберите из списка"
                  allowClear
                >
                  {menu_categories.map((v) => (
                    <Select.Option key={v._id} value={v._id}>
                      {v.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="available">
                <Select
                  style={{ width: 200 }}
                  placeholder="Выберите из списка"
                  allowClear
                >
                  <Select.Option value="1">Активные</Select.Option>
                  <Select.Option value="2">Неактивные</Select.Option>
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
              rowKey="_id"
              dataSource={menu_items}
              loading={loading}
              pagination={false}
            />
          </Content>
        </Layout>
      </Context.Provider>
    </>
  );
};

export default Screen;
