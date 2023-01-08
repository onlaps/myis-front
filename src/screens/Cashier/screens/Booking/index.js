import React, { useEffect, useRef, useState } from "react";
import { Table, Form, DatePicker } from "antd";
import { Button, Layout, PageHeader } from "antd";
import { columns } from "./data";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import _ from "lodash";
import moment from "moment";
import { useNavigate } from "react-router";

const { Content } = Layout;

const Comp = () => {
  const [filters, setFilters] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [sorter, setSorter] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilters(filters);
    setSorter({ [sorter.field]: sorter.order });
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useRef();
  const books = useSelector((state) => state.app.books || []);
  const places = useSelector((state) => state.app.places || []);

  useEffect(() => {
    getData();
  }, []);

  const onFinish = async () => {
    getData();
  };

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
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
        const date = moment(item.date).format("DD.MM.YYYY");
        return `${date}, ${item.time_from} - ${item.time_to}`;
      },
    },
    createdAt: {
      render: (val) => {
        return moment(val).format("DD.MM.YYYY");
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
          initialValues={{ date: moment() }}
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
          columns={columns(options, filters, sorter)}
          onChange={onChange}
          rowKey="_id"
          dataSource={books}
          loading={loading}
          pagination={false}
        />
      </Content>
    </Layout>
  );
};

export default Comp;
