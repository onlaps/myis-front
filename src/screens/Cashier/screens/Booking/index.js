import React, { useEffect, useRef, useState } from "react";
import { Table, Form, DatePicker } from "antd";
import { Button, Layout } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { columns } from "./data";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import _ from "lodash";
import dayjs from "dayjs";
import { useNavigate } from "react-router";

const { Content } = Layout;

const Comp = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useRef();
  const books = useSelector((state) => state.app.books || []);

  useEffect(() => {
    getData();
  }, []); //eslint-disable-line

  const onFinish = async () => {
    getData();
  };

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
      values.date = dayjs(values.date).format("YYYY-MM-DD");
      const query = queryString.stringify(values);
      const { data } = await dispatch(call({ url: `books?${query}` }));
      dispatch(SET_APP(["books"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const options = {
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
  };

  const onBack = () => {
    navigate("/cashier/main");
  };

  return (
    <Layout>
      <PageHeader title="Бронирование" ghost={false} onBack={onBack} />
      <Content className="main__content__layout">
        <Form
          style={{ marginBottom: 16 }}
          ref={form}
          layout="inline"
          onFinish={onFinish}
          initialValues={{ date: dayjs() }}
        >
          <Form.Item name="date">
            <DatePicker format="DD.MM.YYYY" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Поиск
            </Button>
          </Form.Item>
        </Form>
        <Table
          columns={columns(options)}
          rowKey="_id"
          dataSource={books}
          loading={loading}
          pagination={false}
          size="small"
        />
      </Content>
    </Layout>
  );
};

export default Comp;
