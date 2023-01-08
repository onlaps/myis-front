import React, { createContext, useEffect, useRef, useState } from "react";
import { Layout, Button, PageHeader, Table, DatePicker } from "antd";
import { Form, Select } from "antd";
import { columns } from "./data";
import Create from "./Create";
import History from "./History";
import Award from "./Award";
import { SET_APP } from "@/actions/app";
import { call } from "@/actions/axios";
import Filters from "@/components/Filters";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import _ from "lodash";

export const Context = createContext();
const { Content } = Layout;

const Screen = () => {
  const [adding, setAdding] = useState(false);
  const [history, setHistory] = useState(false);
  const [user, setUser] = useState(false);
  const [data, setData] = useState([]);
  const form = useRef();
  const [loading, setLoading] = useState(false);
  // const [pagination, setPagination] = useState({
  //   current: 1,
  //   total: 10,
  // });
  // const [filters, setFilters] = useState(null);
  // const [sorter, setSorter] = useState(null);

  // const onChange = (pagination, filters, sorter) => {
  //   setPagination(pagination);
  //   setFilters(filters);
  //   setSorter({ [sorter.field]: sorter.order });
  // };

  const dispatch = useDispatch();
  const places = useSelector((state) => state.app.places || []);

  const getPlaces = async () => {
    try {
      setLoading(true);
      const { data } = await dispatch(call({ url: "places" }));
      dispatch(SET_APP(["places"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
      values.date = moment(values.date).format("YYYY-MM-DD");
      const query = queryString.stringify(values);
      const { data } = await dispatch(
        call({ url: `users/salaries/count?${query}` })
      );
      setData(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlaces();
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const options = {
    actions: {
      render: (_, item) => {
        return <div className="actions">123</div>;
      },
    },
    shifts: {
      render: (v) => {
        return v.length;
      },
    },
    guests: {
      render: (v) => {
        return _.sum(v, "guests");
      },
    },
    menu_items: {
      render: (v) => {
        return v.length;
      },
    },
    bonus: {
      render: (v) => {
        return (
          <Button size="small" type="link" onClick={() => setHistory(true)}>
            {v}
          </Button>
        );
      },
    },
    name: {
      render: (v, item) => {
        return (
          <Button size="small" type="link" onClick={() => setUser(item)}>
            {v}
          </Button>
        );
      },
    },
  };

  const onFinish = () => {
    getData();
  };

  const items = () => {
    return data;
    return _.filter(
      data,
      (o) => o.shift_users.length > 0 && o.shifts.length > 0
    );
  };

  return (
    <>
      <Context.Provider
        value={{ adding, setAdding, history, setHistory, user, setUser }}
      >
        <Create />
        <History />
        <Award />
        <Layout>
          <PageHeader
            title="Расчет зарплаты"
            ghost={false}
            extra={[
              <Button
                key="create"
                type="primary"
                onClick={() => setAdding(true)}
              >
                Создать
              </Button>,
            ]}
          />
          <Content className="main__content__layout">
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
                <DatePicker format="MMM YYYY" picker="month" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Поиск
                </Button>
              </Form.Item>
            </Filters>
            <Table
              dataSource={items()}
              columns={columns(options)}
              // onChange={onChange}
              loading={loading}
              pagination={false}
            />
          </Content>
        </Layout>
      </Context.Provider>
    </>
  );
};

export default Screen;
