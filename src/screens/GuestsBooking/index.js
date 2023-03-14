import React, { useState, createContext, useEffect } from "react";
import { Layout, Tabs, Button } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Booking, Tables, Statistic } from "./Tabs";
import { useDispatch } from "react-redux";
import { call } from "@/actions/axios";
import { GET_PLACES } from "@/actions/api";
import { SET_APP } from "@/actions/app";
import Create from "./Create";

export const Context = createContext();

const { Content } = Layout;

const Screen = (props) => {
  const [activeKey, setActiveKey] = useState("1");
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

  const items = [
    {
      key: "1",
      label: "Список",
      children: <Booking />,
    },
    {
      key: "2",
      label: "Статистика бронирований",
      children: <Statistic />,
    },
    {
      key: "3",
      label: "Залы и столики",
      children: <Tables />,
    },
  ];

  return (
    <Context.Provider
      value={{ adding, setAdding, activeKey, editing, setEditing }}
    >
      <Create />
      <Layout>
        <PageHeader
          title="Бронирование"
          ghost={false}
          extra={[
            <Button key="create" type="primary" onClick={() => setAdding(true)}>
              Создать
            </Button>,
          ]}
        />
        <Content className="main__content__layout">
          <Tabs onChange={onTabClick} activeKey={activeKey} items={items} />
        </Content>
      </Layout>
    </Context.Provider>
  );
};

export default Screen;
