import React, { useState, createContext, useEffect } from "react";
import { Layout, PageHeader, Tabs, Button } from "antd";
import { Booking, Tables, Statistic } from "./Tabs";
import { useDispatch, useSelector } from "react-redux";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import Create from "./Create";

export const Context = createContext();

const { Content } = Layout;
const { TabPane } = Tabs;

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
    getPlaces();
    getCards();
  }, []);

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

  const getPlaces = async () => {
    try {
      const { data } = await dispatch(call({ url: `places` }));
      dispatch(SET_APP(["places"], data));
    } catch (e) {}
  };

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
          <Tabs onTabClick={onTabClick} activeKey={activeKey}>
            <TabPane tab="Бронирование" key="1">
              <Booking />
            </TabPane>
            <TabPane tab="Статистика бронирований" key="2">
              <Statistic />
            </TabPane>
            <TabPane tab="Залы и столики" key="3">
              <Tables />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Context.Provider>
  );
};

export default Screen;
