import React, { createContext, useEffect, useRef, useState } from "react";
import { Layout, Button, Table } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Dropdown, Modal, Popover } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Form, Select, DatePicker } from "antd";
import { columns } from "./data";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { GET_PLACES } from "@/actions/api";
import dayjs from "dayjs";
import In from "./In";
import Out from "./Out";
import Move from "./Move";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import Filters from "@/components/Filters";
import useAccesses from "@/hooks/useAccesses";
import { isAllowed } from "@/utils";
import _ from "lodash";

const { RangePicker } = DatePicker;
const { Content } = Layout;
const { confirm } = Modal;

export const Context = createContext();

const Screen = (props) => {
  const deleteAccesses = useAccesses(["delete"]);
  const createAccesses = useAccesses(["create"]);
  const form = useRef();
  const [type, setType] = useState(null);
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

  const wh_actions = useSelector((state) => state.app.wh_actions);
  const places = useSelector((state) => state.app.places);
  const wh_items = useSelector((state) => state.app.wh_items);

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
      values.page = pagination.current;
      if (values.period) {
        values.start_at = dayjs(values.period[0]).format("YYYY-MM-DD");
        values.end_at = dayjs(values.period[1]).format("YYYY-MM-DD");
      }
      if (!values.action) values.action = ["in", "out", "move"];
      const query = queryString.stringify(values);
      const { data } = await dispatch(call({ url: `wh_actions?${query}` }));
      const { data: items, ...p } = data;
      setPagination(p);
      dispatch(SET_APP(["wh_actions"], items));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getWhReasons = async () => {
    try {
      const { data } = await dispatch(call({ url: `wh_reasons` }));
      dispatch(SET_APP(["wh_reasons"], data));
    } catch (e) {}
  };

  const getWhItems = async () => {
    try {
      const { data } = await dispatch(call({ url: `wh_items` }));
      dispatch(SET_APP(["wh_items"], data));
    } catch (e) {}
  };

  useEffect(() => {
    getData();
  }, [pagination.current]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getWhReasons();
    getWhItems();
    dispatch(GET_PLACES());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await dispatch(call({ url: `wh_actions/${id}`, method: "DELETE" }));
      await getData();
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onClick = (item) => (e) => {
    if (e.key === "1") {
      confirm({
        title: "Вы уверены?",
        icon: <ExclamationCircleOutlined />,
        content: "Данное действие невозможно отменить!",
        onOk() {
          onDelete(item._id);
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    }
  };

  const items = [
    {
      key: "1",
      label: "Удалить",
      disabled: !isAllowed("wh_actions", deleteAccesses),
    },
  ];

  const options = {
    actions: {
      render: (_, item) => {
        return (
          <Dropdown menu={{ items, onClick: onClick(item) }}>
            <EllipsisOutlined />
          </Dropdown>
        );
      },
    },
    date: {
      render: (value, item) => {
        return dayjs(`${value} ${item.time}`).format("DD.MM.YYYY HH:mm");
      },
    },
    action: {
      render: (value, item) => {
        if (value === "in") return "Поступление";
        else if (value === "out") return "Списание";
        else if (value === "move") {
          return (
            <Popover
              content={item?.place_to?.name}
              trigger="hover"
              placement="bottom"
            >
              <Button type="link">Перемещение</Button>
            </Popover>
          );
        }
      },
    },
    total: {
      render: (v, item) => {
        return _.sumBy(item.items, "total");
      },
    },
    items: {
      render: (val) => {
        return (
          <Popover
            content={val.map((v) => {
              return (
                <div key={v._id}>
                  {v.wh_item.name}, {v.wh_item.wh_unit.name} ({v.amount} x{" "}
                  {v.price}) - {v.total}
                </div>
              );
            })}
            trigger="hover"
            placement="bottom"
          >
            <Button type="link">Показать</Button>
          </Popover>
        );
      },
    },
    description: {
      render: (val, item) => {
        let text = [];

        if (item.reason) text.push(item.reason.name);
        if (val) text.push(val);

        if (text.length === 0) return null;

        text = text.map((v) => <div>{v}</div>);

        return (
          <Popover content={text} trigger="hover" placement="bottom">
            <Button type="link">Показать</Button>
          </Popover>
        );
      },
    },
  };

  const onFinish = () => {
    getData();
  };

  const extra = [];

  if (isAllowed("wh_items", createAccesses)) {
    extra.push(
      <Button key="in" type="primary" onClick={() => setType("in")}>
        Поступление
      </Button>
    );
    extra.push(
      <Button key="out" type="primary" onClick={() => setType("out")}>
        Списание
      </Button>
    );
    extra.push(
      <Button key="move" type="primary" onClick={() => setType("move")}>
        Перемещение
      </Button>
    );
  }

  return (
    <Context.Provider value={{ type, setType }}>
      <In />
      <Out />
      <Move />
      <Layout>
        <PageHeader title="Движение товара" ghost={false} extra={extra} />
        <Content className="main__content__layout">
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
              <RangePicker format="DD.MM.YYYY" allowClear={false} />
            </Form.Item>
            <Form.Item name="action">
              <Select
                style={{ width: 200 }}
                placeholder="Выберите из списка"
                allowClear
              >
                <Select.Option value="in">Поступление</Select.Option>
                <Select.Option value="out">Списание</Select.Option>
                <Select.Option value="move">Перемещение</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="wh_item">
              <Select
                style={{ width: 200 }}
                placeholder="Выберите из списка"
                allowClear
              >
                {wh_items &&
                  wh_items.map((v) => (
                    <Select.Option key={v._id} value={v._id}>
                      {v.name}
                    </Select.Option>
                  ))}
              </Select>
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
            dataSource={wh_actions}
            loading={loading}
            pagination={pagination}
            onChange={onChange}
          />
        </Content>
      </Layout>
    </Context.Provider>
  );
};

export default Screen;
