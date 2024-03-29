import React, { useRef, useState, useEffect, useContext } from "react";
import { Table, Form, Select, Button, DatePicker, Popover } from "antd";
import { columns } from "./data";
import _ from "lodash";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { Context } from "../..";
import queryString from "query-string";
import Filters from "@/components/Filters";

const Comp = () => {
  const context = useContext(Context);
  const { activeKey } = context;
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const form = useRef();
  const books = useSelector((state) => state.app.books || []);
  const places = useSelector((state) => state.app.places || []);

  useEffect(() => {
    if (activeKey === "2") {
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
      if (values.period && _.isArray(values.period)) {
        const [start_at, end_at] = values.period;
        values.start_at = dayjs(start_at).format("YYYY-MM-DD");
        values.end_at = dayjs(end_at).format("YYYY-MM-DD");
      }
      const query = queryString.stringify(values);
      const { data } = await dispatch(call({ url: `books?${query}` }));
      dispatch(SET_APP(["books"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const options = {
    date: {
      render: (val) => dayjs(val).format("DD.MM.YYYY"),
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
        <Form.Item name="period">
          <DatePicker.RangePicker format="DD.MM.YYYY" />
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
