import React, { useState, useEffect, createContext } from "react";
import { Col, Card, Table, Button, Popover } from "antd";
import { Modal, Dropdown } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { columns } from "./data";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import dayjs from "dayjs";
import "./index.less";
import Create from "./Create";

export const Context = createContext();
const { confirm } = Modal;

const CashAction = () => {
  const [type, setType] = useState(null);
  const [loading, setLoading] = useState(false);

  const shift_cash = useSelector((state) => state.app.shift_cash || []);
  const current_shift = useSelector((state) => state.app.current_shift);

  const dispatch = useDispatch();

  const getData = async () => {
    try {
      setLoading(true);
      const query = queryString.stringify({ shift: current_shift._id });
      const { data } = await dispatch(call({ url: `shift_cash?${query}` }));

      dispatch(SET_APP(["shift_cash"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []); //eslint-disable-line

  const onDelete = async (item) => {
    try {
      setLoading(true);
      await dispatch(call({ url: `shift_cash/${item._id}`, method: "DELETE" }));
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

  const items = [
    {
      key: "1",
      label: "Удалить",
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
    createdAt: {
      render: (val) => {
        return dayjs(val).format("DD.MM.YYYY HH:mm");
      },
    },
    amount: {
      render: (val, item) => {
        if (item.type === "in")
          return <p className="positive-cell">{`+${val}`}</p>;
        else if (item.type === "out")
          return <p className="negative-cell">{`-${val}`}</p>;
      },
    },
    description: {
      render: (val) => {
        if (!val) return null;
        return (
          <Popover content={val} trigger="hover" placement="bottom">
            <Button type="link">Показать</Button>
          </Popover>
        );
      },
    },
  };

  return (
    <Context.Provider value={{ type, setType }}>
      <Create />
      <Col span={18}>
        <Card
          className="shift_cash"
          extra={[
            <Button key="in" type="primary" onClick={() => setType("in")}>
              Внести наличные
            </Button>,
            <Button key="out" type="primary" onClick={() => setType("out")}>
              Изъять наличные
            </Button>,
          ]}
        >
          <Table
            columns={columns(options)}
            pagination={false}
            rowKey="_id"
            dataSource={shift_cash}
            loading={loading}
          />
        </Card>
      </Col>
    </Context.Provider>
  );
};

export default CashAction;
