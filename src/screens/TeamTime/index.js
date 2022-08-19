import React, { createContext, useEffect, useState } from "react";
import { Button, Layout, PageHeader, Tabs } from "antd";
import { Shifts, Employees } from "./Tabs";
import Create from "./Create";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";

const { Content } = Layout;
const { TabPane } = Tabs;

export const Context = createContext();

const Screen = (props) => {
  const [activeKey, setActiveKey] = useState("1");
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataFilters, setDataFilters] = useState({});

  const dispatch = useDispatch();

  const onTabClick = (activeKey) => {
    setActiveKey(activeKey);
    setAdding(false);
  };

  useEffect(() => {
    if (!adding) setEditing(null);
    getData();
  }, [adding]);

  const getUsers = async () => {
    try {
      const { data } = await dispatch(call({ url: "users" }));
      dispatch(SET_APP(["users"], data));
    } catch (e) {}
  };

  const getPlaces = async () => {
    try {
      const { data } = await dispatch(call({ url: "places" }));
      dispatch(SET_APP(["places"], data));
    } catch (e) {}
  };

  const getData = async () => {
    try {
      setLoading(true);
      const query = queryString.stringify(dataFilters);
      const { data } = await dispatch(call({ url: `schedules?${query}` }));
      dispatch(SET_APP(["schedules"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
    getPlaces();
    getData();
  }, [dataFilters]);

  return (
    <Layout>
      <PageHeader
        title="График работы"
        ghost={false}
        extra={[
          <Button key="create" type="primary" onClick={() => setAdding(true)}>
            Создать смену
          </Button>,
        ]}
      />
      <Content className="main__content__layout">
        <Context.Provider
          value={{
            adding,
            activeKey,
            setAdding,
            editing,
            setEditing,
            loading,
            setDataFilters,
            dataFilters,
          }}
        >
          <Create />
          <Tabs onTabClick={onTabClick} activeKey={activeKey}>
            <TabPane tab="По сменам" key="1">
              <Shifts />
            </TabPane>
            <TabPane tab="По сотрудникам" key="2">
              <Employees />
            </TabPane>
          </Tabs>
        </Context.Provider>
      </Content>
    </Layout>
  );
};

export default Screen;
