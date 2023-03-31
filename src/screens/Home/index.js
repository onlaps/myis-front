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

  return (
    <Content className="main__content__layout">
      <Row gutter={[16, 16]} style={{ marginBottom: 12 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Клиентов, сегодня"
              value={`${agg("online_guests")}/${agg("offline_guests")}`}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Выручка, сегодня"
              value={agg("revenue_today")}
              groupSeparator=" "
              suffix="₸"
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Клиентов, в среднем"
              value={_.meanBy(data, "total_guests_month")}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Выручка, с начала месяца"
              value={agg("revenue_month")}
              groupSeparator=" "
              suffix="₸"
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Расходы, с начала месяца"
              value={agg("expenses_month")}
              groupSeparator=" "
              suffix="₸"
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Прибыль, с начала месяца"
              value={agg("profit_month")}
              groupSeparator=" "
              suffix="₸"
            />
          </Card>
        </Col>
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
