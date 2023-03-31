import React, { useContext, useEffect, useRef, useState } from "react";
import { Table, Form, Select, Button, DatePicker } from "antd";
import { columns } from "./data";
import { useSelector, useDispatch } from "react-redux";
import queryString from "query-string";
import Filters from "@/components/Filters";
import { call } from "@/actions/axios";
import { GET_PLACES } from "@/actions/api";
import { Context } from "../..";
import dayjs from "dayjs";

const Comp = () => {
  const context = useContext(Context);
  const { activeKey } = context;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const form = useRef();

  const places = useSelector((state) => state.app.places || []);

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
      if (values.period) {
        const [start_at, end_at] = values.period;
        values.start_at = dayjs(start_at).format("YYYY-MM-DD");
        values.end_at = dayjs(end_at).add(1, "day").format("YYYY-MM-DD");
      }
      const query = queryString.stringify(values);
      const { data } = await dispatch(
        call({ url: `tariffs/statistic?${query}` })
      );
      setData(data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeKey === "2") {
      dispatch(GET_PLACES());
      getData();
    }
  }, [activeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFinish = () => {
    getData();
  };

  const options = {};

  return (
    <>
      <Filters ref={form} onFinish={onFinish}>
        <Form.Item name="place">
          <Select style={{ width: 200 }} placeholder="Все торговые точки">
            {places &&
              places.map((v) => (
                <Select.Option key={v._id} value={v._id}>
                  {v.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="period">
          <DatePicker.RangePicker format="DD.MM.YYYY" allowClear={false} />
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
        pagination={false}
        dataSource={data}
        loading={loading}
      />
    </>
  );
};

export default Comp;
