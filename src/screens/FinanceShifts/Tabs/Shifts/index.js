import React, { useRef, useState } from "react";
import { Table, Form, Select, Button, DatePicker } from "antd";
import Filters from "@/components/Filters";
import { columns } from "./data";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import { SET_APP } from "@/actions/app";
import { GET_PLACES } from "@/actions/api";
import { call } from "@/actions/axios";
import dayjs from "dayjs";
import { useEffect } from "react";

const Comp = () => {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 10,
  });
  const [sorter, setSorter] = useState(null);

  const form = useRef();
  const dispatch = useDispatch();

  const places = useSelector((state) => state.app.places || []);
  const shifts = useSelector((state) => state.app.shifts || []);

  const onChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilters(filters);
    setSorter({ [sorter.field]: sorter.order });
  };

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
      values.page = pagination.current;
      if (values.period) {
        const [start_at, end_at] = values.period;
        values.start_at = dayjs(start_at).format("YYYY-MM-DD");
        values.end_at = dayjs(end_at).format("YYYY-MM-DD");
      }
      const query = queryString.stringify(values);

      const { data } = await dispatch(call({ url: `shifts/get/all?${query}` }));
      const { data: items, ...p } = data;
      setPagination(p);

      dispatch(SET_APP(["shifts"], items));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(GET_PLACES());
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onFinish = () => {
    getData();
  };

  const options = {
    user: {
      render: (val) => {
        return val?.name;
      },
    },
    date: {
      render: (val, item) => {
        const data = [dayjs(item.createdAt).format("HH:mm")];
        if (item.closed) {
          data.push(dayjs(item.closedAt).format("HH:mm"));
        } else {
          data.push("открыта");
        }

        return data.join(" - ");
      },
    },
  };

  return (
    <>
      <Filters ref={form} onFinish={onFinish}>
        <Form.Item name="place">
          <Select
            style={{ width: 200 }}
            placeholder="Все торговые точки"
            loading={loading}
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
          <DatePicker.RangePicker format="DD.MM.YYYY" loading={loading} />
        </Form.Item>
        <Form.Item name="closed">
          <Select style={{ width: 150 }} placeholder="Выберите из списка">
            <Select.Option value={true}>Закрытые</Select.Option>
            <Select.Option value={false}>Открытые</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Поиск
          </Button>
        </Form.Item>
      </Filters>
      <Table
        dataSource={shifts}
        rowKey="_id"
        loading={loading}
        columns={columns(options, filters, sorter)}
        pagination={pagination}
        onChange={onChange}
      />
    </>
  );
};

export default Comp;
