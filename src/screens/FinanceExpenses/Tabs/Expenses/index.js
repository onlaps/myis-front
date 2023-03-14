import React, { useContext, useEffect, useRef, useState } from "react";
import { Table, Form, Select, Button, DatePicker, Popover } from "antd";
import { Dropdown, Modal } from "antd";
import { columns, types } from "./data";
import { call } from "@/actions/axios";
import { GET_PLACES } from "@/actions/api";
import { SET_APP } from "@/actions/app";
import { useSelector, useDispatch } from "react-redux";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import queryString from "query-string";
import Filters from "@/components/Filters";
import { Context } from "../..";
import dayjs from "dayjs";
import _ from "lodash";

const { confirm } = Modal;

const Comp = () => {
  const { activeKey } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 10,
  });
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
      const { data } = await dispatch(call({ url: `users/all` }));
      dispatch(SET_APP(["exp_users"], data));
    } catch (e) {}
  };

  const getExpenseCategories = async () => {
    try {
      const { data } = await dispatch(call({ url: `expense_categories` }));
      dispatch(SET_APP(["expense_categories"], data));
    } catch (e) {}
  };

  useEffect(() => {
    dispatch(GET_PLACES());
    getUsers();
    getExpenseCategories();
    if (activeKey === "1") {
      getData();
    }
  }, [activeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
      if (values.period) {
        const [start_at, end_at] = values.period;
        values.start_at = dayjs(start_at).format("YYYY-MM-DD");
        values.end_at = dayjs(end_at).format("YYYY-MM-DD");
      }

      values.page = pagination.current;

      const query = queryString.stringify(values);
      const { data } = await dispatch(call({ url: `expenses?${query}` }));
      const { data: items, ...p } = data;
      setPagination(p);
      dispatch(SET_APP(["expenses"], items));
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await dispatch(call({ url: `expenses/${id}`, method: "DELETE" }));
      await getData();
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
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

  const items = [
    {
      key: "2",
      label: "Удалить",
    },
  ];

  const renderPositions = (v) => {
    let text = `${v.expense_category.name} - ${v.total} ₸`;
    if (v.expense_category.with_employee) {
      text = `${v.expense_category.name} (${v.user.name}) - ${v.total} ₸`;
    }
    return <div key={v._id}>{text} </div>;
  };

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
    user: {
      render: (val) => {
        return val ? val.name : null;
      },
    },
    date: {
      render: (val) => {
        if (!val) return;
        return dayjs(val).format("DD.MM.YYYY");
      },
    },
    items: {
      render: (val) => {
        if (!_.isArray(val) || val.length === 0) return null;
        return (
          <Popover
            content={val.map(renderPositions)}
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
      <Filters ref={form} onFinish={onFinish}>
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
        <Form.Item name="period">
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
      </Filters>
      <Table
        dataSource={expenses}
        columns={columns(options, filters, sorter)}
        onChange={onChange}
        rowKey="_id"
        loading={loading}
        pagination={pagination}
      />
    </>
  );
};

export default Comp;
