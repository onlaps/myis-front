import React, { createContext, useRef, useState, useEffect } from "react";
import { Layout, Button, Table, Dropdown, Modal } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Form, Select } from "antd";
import { columns } from "./data";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { GET_PLACES } from "@/actions/api";
import Create from "./Create";
import History from "./History";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import Filters from "@/components/Filters";
import useAccesses from "@/hooks/useAccesses";
import { isAllowed } from "@/utils";
import _ from "lodash";

const { confirm } = Modal;

export const Context = createContext();
const { Content } = Layout;

const Screen = (props) => {
  const editAccesses = useAccesses(["edit"]);
  const deleteAccesses = useAccesses(["delete"]);
  const createAccesses = useAccesses(["create"]);
  const [adding, setAdding] = useState(false);
  const [history, setHistory] = useState(false);
  const form = useRef();

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const dispatch = useDispatch();

  const wh_items = useSelector((state) => state.app.wh_items);
  const places = useSelector((state) => state.app.places || []);
  const wh_categories = useSelector((state) => state.app.wh_categories || []);

  useEffect(() => {
    if (!adding) setEditing(null);
  }, [adding]);

  useEffect(() => {
    if (!history) setEditing(null);
  }, [history]);

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
      const query = queryString.stringify(values);
      const { data } = await dispatch(call({ url: `wh_items?${query}` }));
      dispatch(SET_APP(["wh_items"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getWhCategories = async () => {
    try {
      const { data } = await dispatch(call({ url: "wh_categories" }));
      dispatch(SET_APP(["wh_categories"], data));
    } catch (e) {}
  };

  const getWhUnits = async () => {
    try {
      const { data } = await dispatch(call({ url: `wh_units` }));
      dispatch(SET_APP(["wh_units"], data));
    } catch (e) {}
  };

  useEffect(() => {
    dispatch(GET_PLACES());
    getWhCategories();
    getWhUnits();
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await dispatch(call({ url: `wh_items/${id}`, method: "DELETE" }));
      await getData();
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onClick = (item) => (e) => {
    if (e.key === "1") {
      setEditing(item);
      setHistory(true);
    } else if (e.key === "2") {
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

  const items = [
    {
      key: "1",
      label: "История изменения",
    },
    {
      key: "2",
      label: "Редактировать",
      disabled: !isAllowed("wh_items", editAccesses),
    },
    {
      key: "3",
      label: "Удалить",
      disabled: !isAllowed("wh_items", deleteAccesses),
    },
  ];

  const options = {
    actions: {
      render: (_, item) => {
        return (
          <Dropdown menu={{ items, onClick: onClick(item) }}>
            <EllipsisOutlined />
          </Dropdown>
        );
      },
    },
    total: {
      render: (val, item) => {
        if (!_.isEmpty(item.wh_item_prices)) {
          return item.wh_item_prices.price * item.wh_item_prices.amount;
        }
        return 0;
      },
    },
    price: {
      render: (val, item) => {
        if (!_.isEmpty(item.wh_item_prices)) return item.wh_item_prices.price;
        return 0;
      },
    },
    amount: {
      render: (val, item) => {
        if (!_.isEmpty(item.wh_item_prices)) return item.wh_item_prices.amount;
        return 0;
      },
    },
  };

  const onFinish = () => {
    getData();
  };

  const extra = [];

  if (isAllowed("wh_items", createAccesses)) {
    extra.push(
      <Button key="create" type="primary" onClick={() => setAdding(true)}>
        Создать
      </Button>
    );
  }

  return (
    <>
      <Context.Provider
        value={{ adding, setAdding, history, setHistory, editing, setEditing }}
      >
        <Create />
        <History />
        <Layout>
          <PageHeader title="Товары" ghost={false} extra={extra} />
          <Content className="main__content__layout">
            <Filters ref={form} onFinish={onFinish}>
              <Form.Item name="place">
                <Select style={{ width: 200 }} placeholder="Все торговые точки">
                  {places.map((v) => (
                    <Select.Option key={v._id} value={v._id}>
                      {v.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="wh_category">
                <Select
                  style={{ width: 200 }}
                  placeholder="Выберите из списка"
                  allowClear
                >
                  {wh_categories.map((v) => (
                    <Select.Option key={v._id} value={v._id}>
                      {v.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Поиск
                </Button>
              </Form.Item>
            </Filters>
            <Table
              columns={columns(options)}
              pagination={false}
              rowKey="_id"
              dataSource={wh_items}
              loading={loading}
            />
          </Content>
        </Layout>
      </Context.Provider>
    </>
  );
};

export default Screen;
