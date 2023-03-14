import React, { createContext, useState } from "react";
import _ from "lodash";
import { Layout, Row, Col, Card, Button, notification } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import data from "./data";
import { useSelector } from "react-redux";
import "./index.less";
import { Report, Expenses, CashAction } from "./Pages";
import { ChecklistsStart, ChecklistsEnd } from "./Pages";
import ShiftUsers from "./ShiftUsers";

const { Content } = Layout;
export const Context = createContext();

const Screen = () => {
  const [isClosing, setIsClosing] = useState(false);
  const [selected, setSelected] = useState(0);
  const current_shift = useSelector((state) => state.app.current_shift);
  const navigate = useNavigate();

  const onBack = () => {
    navigate("/cashier/main");
  };

  const getTitle = () => {
    return `Смена - ${dayjs(current_shift.createdAt).format("DD.MM.YYYY")}`;
  };

  const onClick = (index) => () => {
    setSelected(index);
  };

  const onClose = async () => {
    if (!_.isNumber(current_shift.balance)) {
      return notification.warning({
        title: "Важно",
        message: "Укажите сумму наличных на конец смены",
      });
    } else if (!_.isNumber(current_shift.card_balance)) {
      return notification.warning({
        title: "Важно",
        message: "Укажите сумму по отчету банка на конец смены",
      });
    }
    setIsClosing(true);
  };

  let extra = [
    <Button type="primary" key="close" onClick={onClose}>
      Закрыть смену
    </Button>,
  ];

  if (selected > 0) extra = [];

  return (
    <Layout>
      <ShiftUsers isClosing={isClosing} setIsClosing={setIsClosing} />
      <PageHeader
        title={getTitle()}
        ghost={false}
        onBack={onBack}
        extra={extra}
      />
      <Content className="main__content__layout">
        <Row gutter={20}>
          <Col span={6}>
            {data.map((item, index) => {
              const classNames = ["shift_menu_item"];

              if (index === selected) classNames.push("active");
              return (
                <Card
                  key={index}
                  className={classNames.join(" ")}
                  hoverable
                  onClick={onClick(index)}
                >
                  <div>{item.icon}</div>
                  <div className="title">{item.title}</div>
                </Card>
              );
            })}
          </Col>
          {selected === 0 && <Report />}
          {selected === 1 && <Expenses />}
          {selected === 2 && <CashAction />}
          {selected === 3 && <ChecklistsStart />}
          {selected === 4 && <ChecklistsEnd />}
        </Row>
      </Content>
    </Layout>
  );
};

export default Screen;
