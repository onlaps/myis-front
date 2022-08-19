import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Dropdown, Form, Menu, Select, Table, Modal } from "antd";
import { columns } from "./data";
import { useDispatch, useSelector } from "react-redux";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { Context } from "../..";
import queryString from "query-string";
import _ from "lodash";

const { confirm } = Modal;

const Comp = () => {
  const context = useContext(Context);
  const { setAdding, setEditing, activeKey } = context;
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

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
      const query = queryString.stringify(values);
      const { data } = await dispatch(call({ url: `rooms?${query}` }));
      dispatch(SET_APP(["rooms"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await dispatch(call({ url: `rooms/${id}`, method: "DELETE" }));
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

  useEffect(() => {
    if (activeKey === "3") getData();
  }, [activeKey]);

  const rooms = useSelector((state) => state.app.rooms || []);

  const form = useRef();
  const onFinish = () => {};

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
            {rooms.map((v) => (
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
      </Form>
      <Table
        columns={columns(options, filters, sorter)}
        onChange={onChange}
        rowKey="_id"
        dataSource={rooms}
        loading={loading}
        pagination={false}
      />
    </>
  );
};

export default Comp;
