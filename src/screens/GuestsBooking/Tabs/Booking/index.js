import React, { useContext, useEffect, useRef, useState } from "react";
import { Table, Form, DatePicker, Popover } from "antd";
import { Select, Button, Dropdown, Modal } from "antd";
import { columns } from "./data";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import Filters from "@/components/Filters";
import { Context } from "../..";
import _ from "lodash";
import dayjs from "dayjs";
import useAccesses from "@/hooks/useAccesses";
import { isAllowed } from "@/utils";

const { confirm } = Modal;

const Comp = () => {
  const editAccesses = useAccesses(["edit"]);
  const deleteAccesses = useAccesses(["delete"]);
  const context = useContext(Context);
  const { setAdding, setEditing, activeKey } = context;
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const form = useRef();
  const books = useSelector((state) => state.app.books || []);
  const places = useSelector((state) => state.app.places || []);

  useEffect(() => {
    if (activeKey === "1") {
      getData();
    }
  }, [activeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFinish = async () => {
    getData();
  };

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
      if (values.date) values.date = dayjs(values.date).format("YYYY-MM-DD");
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
      disabled: !isAllowed("guest_card_booking", editAccesses),
    },
    {
      key: "2",
      label: "Удалить",
      disabled: !isAllowed("guest_card_booking", deleteAccesses),
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
        const date = dayjs(item.date).format("DD.MM.YYYY");
        return `${date}, ${item.time_from} - ${item.time_to}`;
      },
    },
    createdAt: {
      render: (val) => {
        return dayjs(val).format("DD.MM.YYYY");
      },
    },
    user: {
      render: (_, item) => {
        return item?.user?.name;
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
    description: {
      render: (val) => {
        if (!val) return null;

        return (
          <Popover content={val} trigger="hover" placement="bottom">
            <Button type="link">Показать</Button>
          </Popover>
        );
      },
    },
  };

  return (
    <>
      <Filters ref={form} onFinish={onFinish}>
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
          <DatePicker format="DD.MM.YYYY" allowClear={false} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Поиск
          </Button>
        </Form.Item>
      </Filters>
      <Table
        columns={columns(options)}
        rowKey="_id"
        dataSource={books}
        loading={loading}
        pagination={false}
      />
    </>
  );
};

export default Comp;
