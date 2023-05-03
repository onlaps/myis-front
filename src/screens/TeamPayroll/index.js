import React, { createContext, useEffect, useRef, useState } from "react";
import { Layout, Button, Table, DatePicker, Tooltip } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { PlusCircleOutlined, EyeOutlined } from "@ant-design/icons";
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
import useAccesses from "@/hooks/useAccesses";
import { isAllowed } from "@/utils";

export const Context = createContext();
const { Content } = Layout;

const Screen = () => {
  const createAccesses = useAccesses(["create"]);
  const [adding, setAdding] = useState(false);
  const [history, setHistory] = useState(false);
  const [user, setUser] = useState(false);
  const form = useRef();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const places = useSelector((state) => state.app.places || []);
  const user_payrolls = useSelector((state) => state.app.user_payrolls || []);
  const salaries_plan = useSelector((state) => state.app.salaries_plan || []);

  const getPlans = async () => {
    try {
      const values = await form.current.validateFields();
      values.date = dayjs(values.date).format("YYYY-MM-DD");
      const query = queryString.stringify(values);

      const { data } = await dispatch(call({ url: `plans?${query}` }));
      dispatch(SET_APP(["salaries_plan"], data));
    } catch (e) {}
  };

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
      await getPlans();
      getData();
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const plan_ = (v, item) => {
    let bonus = 0;
    const plan = _.find(salaries_plan, (sp) =>
      _.find(sp.salaries, (s) => s._id === item.salary._id)
    );

    if (plan) {
      item?.shift_users.forEach((o) => {
        if (o.shift.item_sum + o.shift.service_sum > plan.shift_plan) {
          bonus += plan.shift_bonus;
        }
      });
      const places = _.groupBy(item?.shift_users, (o) => o.shift.place);

      Object.keys(places).forEach((p) => {
        const sum = _.sumBy(
          places[p],
          (o) => o.shift.item_sum + o.shift.service_sum
        );
        if (sum > plan.place_plan) {
          bonus += plan.place_bonus;
        } else if (sum > plan.place_goal_plan) {
          bonus += plan.place_goal_bonus;
        }
      });
    }

    return bonus;
  };

  const bonuses_ = (type, html = true) => {
    return (v, item) => {
      const total = _.sumBy(item.bonuses, (o) => {
        if (o.type === type) return o.value;
        return 0;
      });
      if (!html) return total;
      return (
        <Tooltip text="Посмотреть штрафы/бонусы">
          <Button size="small" type="link" onClick={() => setHistory(item)}>
            <span>{total}</span>
            <EyeOutlined />
          </Button>
        </Tooltip>
      );
    };
  };

  const hours_ = (v, item) => {
    const sum = _.sumBy(item?.shift_users, "duration");
    const hours = Math.round(sum / 60);

    return hours;
  };
  const shifts_ = (v, item) => item?.shift_users?.length;

  const salary_ = (v, item) => {
    return (
      item.salary.hourly * hours_(v, item) +
      item.salary.shiftly * shifts_(v, item)
    );
  };

  const prepaid_ = (v, item) => {
    const sum = _.sumBy(item?.expenses, "total");
    return sum;
  };

  const options = {
    shifts: {
      render: shifts_,
    },
    hours: {
      render: hours_,
    },
    guests: {
      render: (v, item) => {
        const sum = _.sumBy(item?.shift_users, (o) => o.shift.guests);
        return sum;
      },
    },
    menu_items: {
      render: (v, item) => {
        const sum = _.sumBy(item?.shift_users, (o) => o.shift.item_sum);
        return sum;
      },
    },
    services: {
      render: (v, item) => {
        const sum = _.sumBy(item?.shift_users, (o) => o.shift.service_sum);
        return sum;
      },
    },
    prepaid: {
      render: prepaid_,
    },
    salary: {
      render: salary_,
    },
    plan: {
      render: plan_,
    },
    bonus: {
      render: bonuses_("bonus"),
    },
    penalty: {
      render: bonuses_("penalty"),
    },
    total: {
      render: (v, item) => {
        const salary = item.fixed_salary || 0;
        return (
          salary -
          prepaid_(v, item) +
          salary_(v, item) +
          plan_(v, item) +
          bonuses_("bonus", false)(v, item) -
          bonuses_("penalty", false)(v, item)
        );
      },
    },
    name: {
      render: (v, item) => {
        return (
          <Tooltip title="Добавить штраф/бонус">
            <Button
              size="small"
              type="link"
              onClick={() => setUser(item)}
              disabled={!isAllowed("team_payroll", createAccesses)}
            >
              <span>{v}</span>
              <PlusCircleOutlined />
            </Button>
          </Tooltip>
        );
      },
    },
  };

  const onFinish = () => {
    getData();
  };

  const items = () => {
    return user_payrolls;
    // return _.filter(user_payrolls, (o) => o.shift_users.length > 0);
  };

  const extra = [];

  if (isAllowed("team_payroll", createAccesses)) {
    extra.push(
      <Button key="create" type="primary" onClick={() => setAdding(true)}>
        Создать
      </Button>
    );
  }

  return (
    <>
      <Context.Provider
        value={{ adding, setAdding, history, setHistory, user, setUser }}
      >
        <Create />
        <History />
        <Award />
        <Layout>
          <PageHeader title="Расчет зарплаты" ghost={false} extra={extra} />
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
