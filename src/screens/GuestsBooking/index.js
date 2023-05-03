import React, { useState, createContext, useEffect } from "react";
import { Layout, Tabs, Button } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Booking, Tables, Statistic } from "./Tabs";
import { useDispatch } from "react-redux";
import { call } from "@/actions/axios";
import { GET_PLACES } from "@/actions/api";
import { SET_APP } from "@/actions/app";
import Create from "./Create";
import useAccesses from "@/hooks/useAccesses";
import { isAllowed } from "@/utils";
import _ from "lodash";

export const Context = createContext();

const { Content } = Layout;

const Screen = (props) => {
  const accesses = useAccesses();
  const createAccesses = useAccesses(["create"]);
  const items = [];

  if (isAllowed("guest_card_booking", accesses)) {
    items.push({
      key: "1",
      label: "Список",
      children: <Booking />,
    });
  }
  if (isAllowed("guest_card_booking_statistic", accesses)) {
    items.push({
      key: "2",
      label: "Статистика бронирований",
      children: <Statistic />,
    });
  }
  if (isAllowed("guest_card_rooms_tables", accesses)) {
    items.push({
      key: "3",
      label: "Залы и столики",
      children: <Tables />,
    });
  }

  let key = null;

  if (items.length > 0) {
    key = _.last(items).key;
  }

  const [activeKey, setActiveKey] = useState(key);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const onTabClick = (activeKey) => {
    setActiveKey(activeKey);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (!adding) setEditing(null);
  }, [adding]);

  useEffect(() => {
    getRooms();
    dispatch(GET_PLACES());
    getCards();
  }, []); //eslint-disable-line

  const getCards = async () => {
    try {
      const { data } = await dispatch(call({ url: `cards` }));
      dispatch(SET_APP(["cards"], data));
    } catch (e) {}
  };

  const getRooms = async () => {
    try {
      const { data } = await dispatch(call({ url: `rooms` }));
      dispatch(SET_APP(["rooms"], data));
    } catch (e) {}
  };

  const extra = [];

  if (
    isAllowed("guest_card_booking", createAccesses) ||
    isAllowed("guest_card_rooms_tables", createAccesses)
  ) {
    extra.push(
      <Button key="create" type="primary" onClick={() => setAdding(true)}>
        Создать
      </Button>
    );
  }

  return (
    <Context.Provider
      value={{ adding, setAdding, activeKey, editing, setEditing }}
    >
      <Create />
      <Layout>
        <PageHeader title="Бронирование" ghost={false} extra={extra} />
        <Content className="main__content__layout">
          <Tabs onChange={onTabClick} activeKey={activeKey} items={items} />
        </Content>
      </Layout>
    </Context.Provider>
  );
};

export default Screen;
