import React, { createContext, useEffect, useRef, useState } from "react";
import { Layout, Button, Table, DatePicker } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Form, Select } from "antd";
import { columns } from "./data";
import Create from "./Create";
import History from "./History";
import Award from "./Award";
import { GET_PLACES } from "@/actions/api";
import { call } from "@/actions/axios";
import Filters from "@/components/Filters";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import _ from "lodash";
import { SET_APP } from "@/actions/app";

export const Context = createContext();
const { Content } = Layout;

const Screen = () => {
  const [adding, setAdding] = useState(false);
  const [history, setHistory] = useState(false);
  const [user, setUser] = useState(false);
  const form = useRef();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const places = useSelector((state) => state.app.places || []);
  const user_payrolls = useSelector((state) => state.app.user_payrolls || []);

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
      values.date = dayjs(values.date).format("YYYY-MM-DD");
      const query = queryString.stringify(values);
      const { data } = await dispatch(
        call({ url: `users/salaries/count?${query}` })
      );
      dispatch(SET_APP(["user_payrolls"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await dispatch(GET_PLACES());
      getData();
    };
    init();
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
    hours: {
      render: (v, item) => {
        return _.sum(
          item.shift_users.map((su) => {
            let hour, minute;
            [hour, minute] = su.start_time.split(":");
            let start_at = dayjs().set("hour", hour).set("minute", minute);
            [hour, minute] = su.end_time.split(":");
            let end_at = dayjs().set("hour", hour).set("minute", minute);
            var duration = end_at.diff(start_at, "hours");
            if (duration < 0) end_at = end_at.add(1, "day");
            duration = end_at.diff(start_at, "hours");
            return duration;
          })
        );
      },
    },
    guests: {
      render: (v, item) => {
        return _.sumBy(item.shifts, "guests");
      },
    },
    menu_items: {
      render: (v) => {
        return v.length;
      },
    },
    bonus: {
      render: (v, item) => {
        const total = _.sumBy(item.bonuses, (o) => {
          if (o.type === "bonus") return o.value;
          return 0;
        });
        return (
          <Button size="small" type="link" onClick={() => setHistory(item)}>
            {total}
          </Button>
        );
      },
    },
    penalty: {
      render: (v, item) => {
        const total = _.sumBy(item.bonuses, (o) => {
          if (o.type === "penalty") return o.value;
          return 0;
        });
        return (
          <Button size="small" type="link" onClick={() => setHistory(item)}>
            {total}
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
    return _.filter(
      user_payrolls,
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
                <DatePicker
                  format="MMM YYYY"
                  picker="month"
                  allowClear={false}
                />
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
              rowKey="_id"
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
