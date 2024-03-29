import React, { useContext, useEffect, useRef, useState } from "react";
import { Table, Form, Input, Button, Modal } from "antd";
import { Dropdown, Popover } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { columns } from "./data";
import { useDispatch, useSelector } from "react-redux";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import Filters from "@/components/Filters";
import queryString from "query-string";
import { Context } from "../..";
import dayjs from "dayjs";
import useAccesses from "@/hooks/useAccesses";
import { isAllowed } from "@/utils";

const { confirm } = Modal;

const Comp = () => {
  const editAccesses = useAccesses(["edit"]);
  const deleteAccesses = useAccesses(["delete"]);
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

  useEffect(() => {
    if (activeKey === "1") {
      getData();
    }
  }, [pagination.current, activeKey]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const items = [
    {
      key: "1",
      label: "Редактировать",
      disabled: !isAllowed("guest_card", editAccesses),
    },
    {
      key: "2",
      label: "Удалить",
      disabled: !isAllowed("guest_card", deleteAccesses),
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
    birthdate: {
      render: (val) => {
        if (val) return dayjs(val).format("DD.MM.YYYY");
        return null;
      },
    },
    first_visit: {
      render: (val) => {
        if (val) return dayjs(val).format("DD.MM.YYYY");
        return null;
      },
    },
    last_visit: {
      render: (val) => {
        if (val) return dayjs(val).format("DD.MM.YYYY");
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
