import React from "react";
import { Layout, Row, Col, Card, Statistic, notification } from "antd";
import { Table } from "antd";
import { columns } from "./data";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { call } from "@/actions/axios";
import { useState } from "react";

const { Content } = Layout;

const Screen = (props) => {
  const [data, setData] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await dispatch(call({ url: `places` }));
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

  return (
    <Content className="main__content__layout">
      <Row gutter={[16, 16]} style={{ marginBottom: 12 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Выручка, сегодня"
              value={1780}
              groupSeparator=" "
              suffix="₸"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Клиентов, сегодня" value={`${17}/${35}`} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Выручка, с начала месяца" value={17} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Клиентов, в среднем" value={17} />
          </Card>
        </Col>
      </Row>
      <Table
        size="small"
        columns={columns}
        dataSource={data}
        rowKey="_id"
        pagination={false}
      />
    </Content>
  );
};

export default Screen;
