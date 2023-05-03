import React, { useEffect, useRef, useState } from "react";
import { Layout } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Table, Form, Select, Button, DatePicker, Popover } from "antd";
import { columns } from "./data";
import { GET_PLACES } from "@/actions/api";
import { DeleteOutlined } from "@ant-design/icons";
import { call } from "@/actions/axios";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import Filters from "@/components/Filters";
import { types } from "@/screens/WarehouseActions/data";
import dayjs from "dayjs";
import _ from "lodash";
import useAccesses from "@/hooks/useAccesses";
import { isAllowed } from "@/utils";

const { Content } = Layout;

const Comp = () => {
  const deleteAccesses = useAccesses(["delete"]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 10,
  });
  const [sorter, setSorter] = useState(null);
  const [data, setData] = useState([]);

  const places = useSelector((state) => state.app.places || []);

  const form = useRef();

  const dispatch = useDispatch();

  const onChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilters(filters);
    setSorter({ [sorter.field]: sorter.order });
  };

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
      values.action = "sell";
      values.page = pagination.current;
      values.date = dayjs(values.date).format("YYYY-MM-DD");
      const query = queryString.stringify(values);

      const { data } = await dispatch(call({ url: `wh_actions?${query}` }));
      const { data: items, ...p } = data;
      setPagination(p);

      setData(items);
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

  const onDelete = async (item) => {
    try {
      setLoading(true);
      await dispatch(call({ url: `orders/${item._id}`, method: "DELETE" }));
      await getData();
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const options = {
    guest: {
      render: (val) => {
        if (!val) return;
        return val?.name;
      },
    },
    user: {
      render: (val) => {
        return val?.name;
      },
    },
    discount: {
      render: (val) => {
        return val?.name;
      },
    },
    type: {
      render: (value) => {
        const item = _.find(types, { value });
        return item?.name;
      },
    },
    positions: {
      render: (_, item) => {
        if (!item?.items) return null;
        const data = item.items.map((v) => (
          <div
            key={v._id}
          >{`${v.menu_item.name} (${v.amount} x ${v.price})₸`}</div>
        ));
        return (
          <Popover content={data} placement="bottom">
            <Button type="link">Показать</Button>
          </Popover>
        );
      },
    },
    sum: {
      render: (val, item) => {
        return _.sumBy(item.items, "total");
      },
    },
    actions: {
      render: (val, item) => {
        return (
          <Button
            type="link"
            onClick={() => onDelete(item)}
            disabled={!isAllowed("sales", deleteAccesses)}
          >
            <DeleteOutlined />
          </Button>
        );
      },
    },
  };

  return (
    <Layout>
      <PageHeader title="История продаж" ghost={false} />
      <Content className="main__content__layout">
        <Filters ref={form} onFinish={onFinish}>
          <Form.Item name="place">
            <Select
              style={{ width: 150 }}
              placeholder="Все торговые точки"
              disabled={loading}
            >
              {places &&
                places.map((v) => (
                  <Select.Option key={v._id} value={v._id}>
                    {v.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name="date">
            <DatePicker
              format="DD.MM.YYYY"
              allowClear={false}
              disabled={loading}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Поиск
            </Button>
          </Form.Item>
        </Filters>
        <Table
          dataSource={data}
          columns={columns(options, filters, sorter)}
          pagination={pagination}
          onChange={onChange}
          loading={loading}
          rowKey="_id"
        />
      </Content>
    </Layout>
  );
};

export default Comp;
