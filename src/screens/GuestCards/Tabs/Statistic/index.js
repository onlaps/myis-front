import React, { useContext, useEffect, useRef, useState } from "react";
import { Table, Form, Button, DatePicker } from "antd";
import { columns } from "./data";
import { Context } from "../..";
import { useDispatch } from "react-redux";
import queryString from "query-string";
import { call } from "@/actions/axios";
import Filters from "@/components/Filters";
import moment from "moment";

const Comp = () => {
  const context = useContext(Context);
  const { activeKey } = context;
  // const [filters, setFilters] = useState(null);
  // const [pagination, setPagination] = useState(null);
  // const [sorter, setSorter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const form = useRef();
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
      if (values.period) {
        const [start_at, end_at] = values.period;
        values.start_at = moment(start_at).format("YYYY-MM-DD");
        values.end_at = moment(end_at).add(1, "day").format("YYYY-MM-DD");
      }
      const query = queryString.stringify(values);
      const { data } = await dispatch(
        call({ url: `places/statistic/guests?${query}` })
      );
      setData(data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeKey === "3") {
      getData();
    }
  }, [activeKey]);

  // const onChange = (pagination, filters, sorter) => {
  // setPagination(pagination);
  // setFilters(filters);
  // setSorter({ [sorter.field]: sorter.order });
  // };

  const onFinish = () => {
    getData();
  };

  const options = {
    guests: {
      render: (val) => {
        return val.length;
      },
    },
  };

  return (
    <>
      <Filters ref={form} onFinish={onFinish}>
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
        pagination={false}
        dataSource={data}
        loading={loading}
        // onChange={onChange}
      />
    </>
  );
};

export default Comp;
