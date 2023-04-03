import React, { useRef, useState } from "react";
import { Table, Form, Select, Button, DatePicker } from "antd";
import Filters from "@/components/Filters";
import { columns } from "./data";
import { useDispatch, useSelector } from "react-redux";
import { GET_PLACES } from "@/actions/api";
import { call } from "@/actions/axios";
import dayjs from "dayjs";
import { useEffect } from "react";

const Comp = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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
        values.end_at = dayjs(end_at).format("YYYY-MM-DD");
      }

      const { data } = await dispatch(
        call({ url: `statistic/abc`, method: "POST", data: values })
      );

      setData(data);
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

  const options = {};

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
        columns={columns(options)}
        pagination={false}
        rowKey="_id"
        bordered
        dataSource={data}
        loading={loading}
      />
    </>
  );
};

export default Comp;
