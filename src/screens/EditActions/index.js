import React, { createContext, useEffect, useRef, useState } from "react";
import { Layout, Button, Table } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Popover } from "antd";
import { Form, Select, DatePicker } from "antd";
import { columns } from "./data";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import Filters from "@/components/Filters";
import _ from "lodash";

const { RangePicker } = DatePicker;
const { Content } = Layout;

export const Context = createContext();

const Screen = (props) => {
  const form = useRef();

  const [pagination, setPagination] = useState({
    current: 1,
    total: 10,
  });
  const [filters, setFilters] = useState(null);
  const [sorter, setSorter] = useState(null);

  const onChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilters(filters);
    setSorter({ [sorter.field]: sorter.order });
  };

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const actions = useSelector((state) => state.app.actions);
  const action_types = useSelector((state) => state.app.action_types || []);
  const users = useSelector((state) => state.app.users || []);

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
      values.page = pagination.current;
      if (values.period) {
        values.start_at = dayjs(values.period[0]).format("YYYY-MM-DD");
        values.end_at = dayjs(values.period[1]).format("YYYY-MM-DD");
      }
      const query = queryString.stringify(values);
      const { data } = await dispatch(call({ url: `actions?${query}` }));
      const { data: items, ...p } = data;
      setPagination(p);
      dispatch(SET_APP(["actions"], items));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getActionTypes = async () => {
    try {
      const { data } = await dispatch(call({ url: `actions/types` }));
      dispatch(SET_APP(["action_types"], data));
    } catch (e) {}
  };

  const getUsers = async () => {
    try {
      const { data } = await dispatch(call({ url: `users/all` }));
      dispatch(SET_APP(["users"], data));
    } catch (e) {}
  };

  useEffect(() => {
    getData();
  }, [pagination.current]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getUsers();
    getActionTypes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const options = {
    createdAt: {
      render: (v, item) => {
        return dayjs(v).format("DD.MM.YYYY HH:mm");
      },
    },
    place: {
      render: (v) => {
        if (v) return v.name;
      },
    },
    user: {
      render: (val) => {
        return val.name;
      },
    },
    type: {
      render: (val) => {
        return val.name;
      },
    },
    description: {
      render: (val) => {
        if (!_.isArray(val)) return null;

        const items = val.map((v) => <div key={v}>{v}</div>);

        return (
          <Popover content={items} trigger="hover" placement="bottom">
            <Button type="link">Показать</Button>
          </Popover>
        );
      },
    },
  };

  const onFinish = () => {
    getData();
  };

  const typesRenderer = () => {
    const grouped = _.groupBy(action_types, "group");
    return Object.keys(grouped).map((v) => {
      const options = grouped[v].map((i) => ({ label: i.name, value: i._id }));

      return {
        label: v,
        options,
      };
    });
  };

  return (
    <Layout>
      <PageHeader title="История действий" ghost={false} />
      <Content className="main__content__layout">
        <Filters ref={form} onFinish={onFinish}>
          <Form.Item name="period">
            <RangePicker format="DD.MM.YYYY" allowClear={false} />
          </Form.Item>
          <Form.Item name="user">
            <Select
              style={{ width: 200 }}
              placeholder="Все пользователи"
              allowClear
            >
              {users &&
                users.map((v) => (
                  <Select.Option key={v._id} value={v._id}>
                    {v.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name="type">
            <Select
              style={{ width: 200 }}
              placeholder="Все действия"
              allowClear
              options={typesRenderer()}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Поиск
            </Button>
          </Form.Item>
        </Filters>
        <Table
          columns={columns(options, filters, sorter)}
          rowKey="_id"
          dataSource={actions}
          loading={loading}
          pagination={pagination}
          onChange={onChange}
        />
      </Content>
    </Layout>
  );
};

export default Screen;
