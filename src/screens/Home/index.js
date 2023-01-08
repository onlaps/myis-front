import React from "react";
import { Layout, Row, Col, Card, Statistic } from "antd";
import { Table } from "antd";
import { columns } from "./data";

const { Content } = Layout;

const Screen = (props) => {
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
      <Table size="small" columns={columns} />
    </Content>
  );
};

export default Screen;
