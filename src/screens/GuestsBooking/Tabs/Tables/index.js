import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Dropdown, Form, Select, Table, Modal } from "antd";
import { columns } from "./data";
import { useDispatch, useSelector } from "react-redux";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { Context } from "../..";
import Filters from "@/components/Filters";
import queryString from "query-string";
import _ from "lodash";
import useAccesses from "@/hooks/useAccesses";
import { isAllowed } from "@/utils";

const { confirm } = Modal;

const Comp = () => {
  const editAccesses = useAccesses(["edit"]);
  const deleteAccesses = useAccesses(["delete"]);
  const context = useContext(Context);
  const { adding, setAdding, setEditing, activeKey } = context;
  // const [filters, setFilters] = useState(null);
  // const [pagination, setPagination] = useState(null);
  // const [sorter, setSorter] = useState(null);
  const [loading, setLoading] = useState(false);

  // const onChange = (pagination, filters, sorter) => {
  //   setPagination(pagination);
  //   setFilters(filters);
  //   setSorter({ [sorter.field]: sorter.order });
  // };

  useEffect(() => {
    getTariffs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getTariffs = async () => {
    try {
      const { data } = await dispatch(call({ url: `tariffs` }));
      dispatch(SET_APP(["tariffs"], data));
    } catch (e) {}
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
      disabled: !isAllowed("guest_card_rooms_tables", editAccesses),
    },
    {
      key: "2",
      label: "Удалить",
      disabled: !isAllowed("guest_card_rooms_tables", deleteAccesses),
    },
  ];

  const rooms = useSelector((state) => state.app.rooms || []);
  const places = useSelector((state) => state.app.places || []);

  useEffect(() => {
    if (activeKey === "3") {
      getData();
    }
  }, [activeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!adding) getData();
  }, [adding]); // eslint-disable-line react-hooks/exhaustive-deps

  const form = useRef();
  const onFinish = () => {
    getData();
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
    tariff: {
      render: (val) => {
        if (!val) return null;
        return val.name;
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
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Поиск
          </Button>
        </Form.Item>
      </Filters>
      <Table
        columns={columns(options)}
        // onChange={onChange}
        rowKey="_id"
        dataSource={rooms}
        loading={loading}
        pagination={false}
      />
    </>
  );
};

export default Comp;
