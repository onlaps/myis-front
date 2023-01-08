import React, { createContext, useEffect, useState } from "react";
import { Row, Col, Card, List, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import _ from "lodash";
import CashEdit from "./CashEdit";
import CardEdit from "./CardEdit";

export const Context = createContext();

const Report = () => {
  const [type, setType] = useState(null);

  const dispatch = useDispatch();

  const current_shift = useSelector((state) => state.app.current_shift);

  useEffect(() => {
    const getShift = async () => {
      const { data } = await dispatch(
        call({ url: `shifts/${current_shift._id}` })
      );
      dispatch(SET_APP(["current_shift"], data));
    };
    getShift();
  }, []);

  const getCashButton = () => {
    return (
      <Button type="link" onClick={() => setType("cash")}>
        {_.isNumber(current_shift.balance)
          ? current_shift.balance
          : "Задать сумму"}
      </Button>
    );
  };

  const getCardButton = () => {
    return (
      <Button type="link" onClick={() => setType("card")}>
        {_.isNumber(current_shift.card_balance)
          ? current_shift.card_balance
          : "Задать сумму"}
      </Button>
    );
  };

  const calculateCash = () => {
    const { start_sum, cash_receiptes, withdrawal, deposit } = current_shift;
    return start_sum - cash_receiptes - withdrawal + deposit;
  };

  return (
    <Context.Provider value={{ setType, type }}>
      <CashEdit />
      <CardEdit />
      <Col span={18}>
        <Row gutter={20}>
          <Col span={12}>
            <Card title="Оплата наличными">
              <ListItem
                title="Сумма на начало"
                value={current_shift.start_sum}
              />
              <ListItem
                title="Выручка наличными"
                value={current_shift.cash_receiptes}
              />
              <ListItem title="Внесения" value={current_shift.deposit} />
              <ListItem title="Изъятия" value={current_shift.withdrawal} />
              <ListItem
                title="Должно остаться в кассе"
                value={calculateCash()}
              />
              <ListItem title="Сумма на конец" value={getCashButton()} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Оплата по карте">
              <ListItem
                title="Выручка по карте"
                value={current_shift.card_receiptes}
              />
              <ListItem title="Сумма по отчету банка" value={getCardButton()} />
            </Card>
          </Col>
        </Row>
      </Col>
    </Context.Provider>
  );
};

const ListItem = ({ title, value }) => {
  return (
    <List.Item>
      <List.Item.Meta title={title} />
      <div>{value}</div>
    </List.Item>
  );
};

export default Report;
