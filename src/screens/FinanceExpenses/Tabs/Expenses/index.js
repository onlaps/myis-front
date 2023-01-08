import React, { useContext, useEffect, useRef, useState } from "react";
import { Table, Form, Select, Button, DatePicker, Popover } from "antd";
import { Dropdown, Menu, Modal } from "antd";
import { columns, types } from "./data";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { useSelector, useDispatch } from "react-redux";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import queryString from "query-string";
import { Context } from "../..";
import moment from "moment";
import _ from "lodash";

const { confirm } = Modal;

const Comp = () => {
  const { activeKey } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [sorter, setSorter] = useState(null);

  const dispatch = useDispatch();
  const form = useRef();

  const onChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilters(filters);
    setSorter({ [sorter.field]: sorter.order });
  };

  const expenses = useSelector((state) => state.app.expenses || []);
  const expense_categories = useSelector(
    (state) => state.app.expense_categories || []
  );
  const places = useSelector((state) => state.app.places || []);

  const getUsers = async () => {
    try {
      const { data } = await dispatch(call({ url: `users` }));
      dispatch(SET_APP(["users"], data));
    } catch (e) {}
  };

  const getPlaces = async () => {
    try {
      const { data } = await dispatch(call({ url: `places` }));
      dispatch(SET_APP(["places"], data));
    } catch (e) {}
  };

  const getExpenseCategories = async () => {
    try {
      const { data } = await dispatch(call({ url: `expense_categories` }));
      dispatch(SET_APP(["expense_categories"], data));
    } catch (e) {}
  };

  useEffect(() => {
    getUsers();
    getPlaces();
    getExpenseCategories();
    if (activeKey === "1") {
      getData();
    }
  }, [activeKey]);

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
      if (values.date) {
        const [start_at, end_at] = values.date;
        values.start_at = moment(start_at).format("YYYY-MM-DD");
        values.end_at = moment(end_at).format("YYYY-MM-DD");
      }

      const query = queryString.stringify(values);
      const { data } = await dispatch(call({ url: `expenses?${query}` }));
      dispatch(SET_APP(["expenses"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onDelete = () => {
    dispatch(
      call({
        url: `expenses`,
        method: "DELETE",
      })
    );
  };

  const onClick = (item) => (e) => {
    if (e.key === "2") {
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
    user: {
      render: (val) => {
        return val ? val.name : null;
      },
    },
    date: {
      render: (val) => {
        if (!val) return;
        return moment(val).format("DD.MM.YYYY");
      },
    },
    items: {
      render: (val) => {
        if (!_.isArray(val) || val.length === 0) return null;
        return (
          <Popover
            content={val.map((v) => (
              <div key={v._id}>
                {v.expense_category.name} - {v.sum} тг
              </div>
            ))}
            trigger="hover"
            placement="bottom"
          >
            <Button type="link">Позиции: {val.length}</Button>
          </Popover>
        );
      },
    },
    total: {
      render: (val, item) => {
        const { items } = item;
        if (!_.isArray(items) || items.length === 0) return null;
        return _.sumBy(items, "total");
      },
    },
  };

  const onFinish = () => {
    getData();
  };

  return (
    <>
      <Form
        style={{ marginBottom: 16 }}
        ref={form}
        layout="inline"
        onFinish={onFinish}
      >
        <Form.Item name="place">
          <Select
            style={{ width: 150 }}
            placeholder="Все торговые точки"
            disabled={loading}
          >
            {places &&
              places.map((v) => (
                <Select.Option key={v._id} value={v._id}>
                  {v.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="date">
          <DatePicker.RangePicker format="DD.MM.YYYY" disabled={loading} />
        </Form.Item>
        <Form.Item name="category">
          <Select
            style={{ width: 150 }}
            placeholder="Выберите из списка"
            disabled={loading}
          >
            {expense_categories &&
              expense_categories.map((v) => (
                <Select.Option key={v._id} value={v._id}>
                  {v.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="type">
          <Select
            style={{ width: 150 }}
            placeholder="Выберите из списка"
            disabled={loading}
          >
            {types &&
              types.map((v) => (
                <Select.Option key={v.value} value={v.value}>
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
      </Form>
      <Table
        dataSource={expenses}
        columns={columns(options, filters, sorter)}
        onChange={onChange}
        rowKey="_id"
        loading={loading}
        pagination={false}
      />
    </>
  );
};

export default Comp;
