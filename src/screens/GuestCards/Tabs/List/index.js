import React, { useContext, useEffect, useRef, useState } from "react";
import { Table, Form, Input, Button, Modal } from "antd";
import { Menu, Dropdown, Popover } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { columns } from "./data";
import { useDispatch, useSelector } from "react-redux";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import Filters from "@/components/Filters";
import queryString from "query-string";
import { Context } from "../..";
import moment from "moment";

const { confirm } = Modal;

const Comp = () => {
  const context = useContext(Context);
  const { setAdding, setEditing, activeKey } = context;
  const [filters, setFilters] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 10,
  });
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
      values.page = pagination.current;
      const query = queryString.stringify(values);
      const { data } = await dispatch(call({ url: `cards?${query}` }));
      const { data: items, ...p } = data;
      dispatch(SET_APP(["cards"], items));
      setPagination(p);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeKey === "1") {
      getData();
      getSources();
    }
  }, [activeKey]); // eslint-disable-line react-hooks/exhaustive-deps

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
      <Filters ref={form} onFinish={onFinish}>
        <Form.Item name="search">
          <Input placeholder="Поиск" allowClear />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Поиск
          </Button>
        </Form.Item>
      </Filters>
      <Table
        columns={columns(options, filters, sorter)}
        onChange={onChange}
        rowKey="_id"
        dataSource={cards}
        loading={loading}
        pagination={pagination}
      />
    </>
  );
};

export default Comp;
