import React from "react";
import { Layout, Row, Col, Card, Statistic, notification } from "antd";
import { Table } from "antd";
import { columns } from "./data";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { call } from "@/actions/axios";
import { useState } from "react";
import _ from "lodash";

const { Content } = Layout;

const Screen = (props) => {
  const [data, setData] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await dispatch(
          call({ url: `places/statistic/total` })
        );
        setData(data);
      } catch (e) {
        notification.error({
          title: "Ошибка",
          message: "Не удалось получить данные",
        });
      }
    };
    getData();
  }, []); // eslint-disable-line

  const options = {};

  const agg = (v) => _.sumBy(data, v);

  const getValue = (v) => {
    if (data.length === 0) return 0;
    if (v === 0) {
      const guests = agg("offline_guests");
      if (guests === 0) return 0;
      return agg("online_guests") / guests;
    } else if (v === 1) return agg("revenue_today");
    else if (v === 2) return _.meanBy(data, "total_guests_month");
    else if (v === 3) return agg("revenue_month");
    else if (v === 4) return agg("expenses_month");
    else if (v === 5) return agg("profit_month");
  };

  const mainTabs = [
    { key: 0, title: "Клиентов, сегодня" },
    { key: 1, title: "Выручка, сегодня", suffix: "₸", decimalSeparator: " " },
    { key: 2, title: "Клиентов, в среднем" },
    {
      key: 3,
      title: "Выручка, с начала месяца",
      suffix: "₸",
      decimalSeparator: " ",
    },
    {
      key: 4,
      title: "Расходы, с начала месяца",
      suffix: "₸",
      decimalSeparator: " ",
    },
    {
      key: 5,
      title: "Прибыль, с начала месяца",
      suffix: "₸",
      decimalSeparator: " ",
    },
  ];

  return (
    <Content className="main__content__layout">
      <Row gutter={[16, 16]} style={{ marginBottom: 12 }}>
        {mainTabs.map(({ key, ...tab }, index) => (
          <Col span={4} key={key}>
            <Card>
              <Statistic {...tab} value={getValue(index)} />
            </Card>
          </Col>
        ))}
      </Row>
      <Table
        size="small"
        columns={columns(options)}
        dataSource={data}
        rowKey="_id"
        pagination={false}
      />
    </Content>
  );
};

export default Screen;
