import React, { useContext, useEffect, useRef, useState } from "react";
import { Table, Form, Input, Button, Modal } from "antd";
import { Menu, Dropdown, Popover } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { columns } from "./data";
import { useDispatch, useSelector } from "react-redux";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import queryString from "query-string";
import { Context } from "../..";
import moment from "moment";

const { confirm } = Modal;

const Comp = () => {
  const context = useContext(Context);
  const { setAdding, setEditing } = context;
  const [filters, setFilters] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [sorter, setSorter] = useState(null);

  const onChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilters(filters);
    setSorter({ [sorter.field]: sorter.order });
  };

  const dispatch = useDispatch();

  const getSources = async () => {
    try {
      const { data } = await dispatch(call({ url: "sources" }));
      dispatch(SET_APP(["sources"], data));
    } catch (e) {}
  };

  const form = useRef();
  const onFinish = () => {
    getData();
  };

  const [loading, setLoading] = useState(false);

  const cards = useSelector((state) => state.app.cards);

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
      const query = queryString.stringify(values);
      const { data } = await dispatch(call({ url: `cards?${query}` }));
      dispatch(SET_APP(["cards"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
    getSources();
  }, []);

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await dispatch(call({ url: `cards/${id}`, method: "DELETE" }));
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
    birthdate: {
      render: (val) => {
        if (val) return moment(val).format("DD.MM.YYYY");
        return null;
      },
    },
    contact: {
      render: (_, val) => {
        const data = [];

        if (val.phone) data.push(val.phone);
        if (val.name) data.push(val.name);

        return data.map((v) => <div key={v}>{v}</div>);
      },
    },
    description: {
      render: (val) => {
        if (val) {
          return (
            <Popover content={val} trigger="hover" placement="bottom">
              <Button type="link">Посмотреть</Button>
            </Popover>
          );
        }
        return null;
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
        <Form.Item name="search">
          <Input placeholder="Поиск" />
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
        dataSource={cards}
        loading={loading}
        pagination={false}
      />
    </>
  );
};

export default Comp;
