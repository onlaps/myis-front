import React, { useRef, useState } from "react";
import { Table, Form, Select, Button, DatePicker, Popover } from "antd";
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

  const dispatch = useDispatch();

  const form = useRef();
  const places = useSelector((state) => state.app.places || []);
  const shift_cash = useSelector((state) => state.app.shift_cash || []);

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

      const { data } = await dispatch(
        call({ url: `shift_cash/place/all?${query}` })
      );
      const { data: items, ...p } = data;
      setPagination(p);

      dispatch(SET_APP(["shift_cash"], items));
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
    createdAt: {
      render: (val) => {
        return dayjs(val).format("DD.MM.YYYY HH:mm");
      },
    },
    amount: {
      render: (val, item) => {
        if (item.type === "in")
          return <p className="positive-cell">{`+${val}`}</p>;
        else if (item.type === "out")
          return <p className="negative-cell">{`-${val}`}</p>;
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
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Поиск
          </Button>
        </Form.Item>
      </Filters>
      <Table
        columns={columns(options, filters, sorter)}
        pagination={pagination}
        onChange={onChange}
        className="shift_cash"
        rowKey="_id"
        dataSource={shift_cash}
        loading={loading}
      />
    </>
  );
};

export default Comp;
