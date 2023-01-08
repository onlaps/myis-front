import React, { useState, useEffect, createContext } from "react";
import { Col, Card, Table, Button, Popover } from "antd";
import { Menu, Modal, Dropdown } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { columns } from "./data";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import _ from "lodash";
import moment from "moment";
import "./index.less";
import Exp from "./Exp";
import Out from "./Out";
import Move from "./Move";

export const Context = createContext();
const { confirm } = Modal;

const Expenses = () => {
  const [type, setType] = useState(null);
  const [loading, setLoading] = useState(false);

  const shift_expenses = useSelector((state) => state.app.shift_expenses || []);
  const current_shift = useSelector((state) => state.app.current_shift);

  const dispatch = useDispatch();

  const getData = async () => {
    try {
      setLoading(true);
      const query = queryString.stringify({ shift: current_shift._id });
      const { data: expenses } = await dispatch(
        call({ url: `expenses?${query}` })
      );
      const { data: wh_actions } = await dispatch(
        call({ url: `wh_actions?${query}` })
      );

      dispatch(SET_APP(["shift_expenses"], [...expenses, ...wh_actions]));
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
  }, []); //eslint-disable-line

  const onDelete = async (item) => {
    try {
      setLoading(true);
      let url = `wh_actions/${item._id}`;
      if (!item.action) url = `expenses/${item._id}`;
      await dispatch(call({ url, method: "DELETE" }));
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
          onDelete(item);
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
        else if (value === "sell") return "Продажа";
        return "Расход";
      },
    },
    place: {
      render: (val, item) => {
        if (item.action === "move") {
          return (
            <>
              <div>{item.place.name}</div>
              <div>{item.place_to.name}</div>
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
        if (val.length === 0) return null;

        const renderItem = (v) => {
          if (v.wh_item) {
            return (
              <div key={v._id}>
                {v.wh_item.name} ({v.amount} x {v.wh_item.wh_unit.name}) -{" "}
                {v.total} тг
              </div>
            );
          } else if (v.expense_category) {
            return (
              <div key={v._id}>
                {v.expense_category.name} - {v.total} тг
              </div>
            );
          } else if (v.menu_item) {
            return (
              <div key={v._id}>
                {v.menu_item.name} ({v.amount} x {v.price}) - {v.total} тг
              </div>
            );
          }
        };

        return (
          <Popover
            content={val.map(renderItem)}
            trigger="hover"
            placement="bottom"
          >
            <Button type="link">Показать</Button>
          </Popover>
        );
      },
    },
  };

  return (
    <Context.Provider value={{ type, setType }}>
      <Col span={18}>
        <Exp />
        <Out />
        <Move />
        <Card
          className="expenses"
          extra={[
            <Button key="in" type="primary" onClick={() => setType("in")}>
              Расход
            </Button>,
            <Button key="out" type="primary" onClick={() => setType("out")}>
              Списание
            </Button>,
            <Button key="move" type="primary" onClick={() => setType("move")}>
              Перемещение
            </Button>,
          ]}
        >
          <Table
            columns={columns(options)}
            pagination={false}
            rowKey="_id"
            dataSource={shift_expenses}
            loading={loading}
          />
        </Card>
      </Col>
    </Context.Provider>
  );
};

export default Expenses;
