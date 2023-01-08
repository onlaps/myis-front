import React, { createContext, useEffect, useRef, useState } from "react";
import { Layout, Button, PageHeader, Table } from "antd";
import { Dropdown, Menu, Modal, Popover } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Form, Select, DatePicker } from "antd";
import { columns } from "./data";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import moment from "moment";
import In from "./In";
import Out from "./Out";
import Move from "./Move";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import _ from "lodash";

const { RangePicker } = DatePicker;
const { Content } = Layout;
const { confirm } = Modal;

export const Context = createContext();

const Screen = (props) => {
  const form = useRef();
  const [filters, setFilters] = useState(null);
  const [sorter, setSorter] = useState(null);
  const [type, setType] = useState(null);

  const onChange = (pagination, filters, sorter) => {
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
      if (values.period) {
        values.start_at = moment(values.period[0]).format("YYYY-MM-DD");
        values.end_at = moment(values.period[1]).format("YYYY-MM-DD");
      }
      if (!values.action) values.action = ["in", "out", "move"];
      const query = queryString.stringify(values);
      const { data } = await dispatch(call({ url: `wh_actions?${query}` }));
      dispatch(SET_APP(["wh_actions"], data));
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

  const getPlaces = async () => {
    try {
      const { data } = await dispatch(call({ url: `places` }));
      dispatch(SET_APP(["places"], data));
    } catch (e) {}
  };

  const getWhItems = async () => {
    try {
      const { data } = await dispatch(call({ url: `wh_items` }));
      dispatch(SET_APP(["wh_items"], data));
    } catch (e) {}
  };

  useEffect(() => {
    getWhReasons();
    getWhItems();
    getPlaces();
    getData();
  }, []);

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

  const menu = (item) => (
    <Menu
      onClick={onClick(item)}
      items={[
        {
          key: "1",
          label: "Удалить",
        },
      ]}
    />
  );

  const options = {
    actions: {
      render: (_, item) => {
        return (
          <Dropdown overlay={menu(item)}>
            <EllipsisOutlined />
          </Dropdown>
        );
      },
    },
    date: {
      render: (value, item) => {
        return moment(`${value} ${item.time}`).format("DD.MM.YYYY HH:mm");
      },
    },
    action: {
      render: (value) => {
        if (value === "in") return "Поступление";
        else if (value === "out") return "Списание";
        else if (value === "move") return "Перемещение";
      },
    },
    place: {
      render: (val, item) => {
        if (item.action === "move") {
          return (
            <>
              <div>{item?.place?.name}</div>
              <div>{item?.place_to?.name}</div>
            </>
          );
        }
        return val.name;
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
                  {v.wh_item.name} ({v.amount} x {v.wh_item.wh_unit.name}) -{" "}
                  {v.total}
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
  };

  const onFinish = () => {
    getData();
  };

  return (
    <Context.Provider value={{ type, setType }}>
      <In />
      <Out />
      <Move />
      <Layout>
        <PageHeader
          title="Движение товара"
          ghost={false}
          extra={[
            <Button key="in" type="primary" onClick={() => setType("in")}>
              Поступление
            </Button>,
            <Button key="out" type="primary" onClick={() => setType("out")}>
              Списание
            </Button>,
            <Button key="move" type="primary" onClick={() => setType("move")}>
              Перемещение
            </Button>,
          ]}
        />
        <Content className="main__content__layout">
          <Form
            style={{ marginBottom: 16 }}
            ref={form}
            layout="inline"
            onFinish={onFinish}
          >
            <Form.Item name="place">
              <Select
                style={{ width: 200 }}
                placeholder="Все торговые точки"
                allowClear
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
              <RangePicker format="DD.MM.YYYY" allowClear />
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
          </Form>
          <Table
            columns={columns(options, filters, sorter)}
            onChange={onChange}
            pagination={false}
            rowKey="_id"
            dataSource={wh_actions}
            loading={loading}
          />
        </Content>
      </Layout>
    </Context.Provider>
  );
};

export default Screen;
