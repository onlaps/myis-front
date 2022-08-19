import React, { useContext, useEffect, useRef, useState } from "react";
import { Table, Form, DatePicker } from "antd";
import { Select, Button, Dropdown, Menu, Modal } from "antd";
import { columns } from "./data";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import { Context } from "../..";
import _ from "lodash";

const { confirm } = Modal;

const Comp = () => {
  const context = useContext(Context);
  const { setAdding, setEditing } = context;
  const [filters, setFilters] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [sorter, setSorter] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilters(filters);
    setSorter({ [sorter.field]: sorter.order });
  };

  const dispatch = useDispatch();

  const form = useRef();
  const books = useSelector((state) => state.app.books);
  const places = useSelector((state) => state.app.places);

  const getCards = async () => {
    try {
      const { data } = await dispatch(call({ url: `cards` }));
      dispatch(SET_APP(["cards"], data));
    } catch (e) {}
  };

  const getPlaces = async () => {
    try {
      const { data } = await dispatch(call({ url: `places` }));
      dispatch(SET_APP(["places"], data));
    } catch (e) {}
  };

  useEffect(() => {
    getCards();
    getPlaces();
    getData();
  }, []);

  const onFinish = async () => {
    getData();
  };

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
      const query = queryString.stringify(values);
      const { data } = await dispatch(call({ url: `books?${query}` }));
      dispatch(SET_APP(["books"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await dispatch(call({ url: `books/${id}`, method: "DELETE" }));
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
        content: "Данное действо невозможно отменить!",
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
    tables: {
      render: (val) => {
        if (_.isEmpty(val) || !_.isArray(val)) return null;

        return val.map((v) => (
          <div key={v._id}>
            {v.number} - {v.name}
          </div>
        ));
      },
    },
    time: {
      render: (_, item) => {
        return `${item.time_from} - ${item.time_to}`;
      },
    },
    client: {
      render: (_, item) => {
        return (
          <>
            <div>{item.phone}</div>
            <div>{item.name}</div>
          </>
        );
      },
    },
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
          <Select style={{ width: 200 }} placeholder="Выберите из списка">
            {places.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="date">
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
        onChange={onChange}
        rowKey="_id"
        dataSource={books}
        loading={loading}
        pagination={false}
      />
    </>
  );
};

export default Comp;
