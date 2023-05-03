import React, { createContext, useEffect, useState } from "react";
import { Button, Layout, Tabs } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Shifts, Employees } from "./Tabs";
import Create from "./Create";
import { call } from "@/actions/axios";
import { GET_PLACES } from "@/actions/api";
import { SET_APP } from "@/actions/app";
import { useDispatch } from "react-redux";
import queryString from "query-string";
import useAccesses from "@/hooks/useAccesses";
import { isAllowed } from "@/utils";
import _ from "lodash";

const { Content } = Layout;

export const Context = createContext();

const Screen = () => {
  const accesses = useAccesses();
  const createAccesses = useAccesses(["create"]);
  const items = [];

  if (isAllowed("team_time_shift", accesses)) {
    items.push({
      key: "1",
      label: "По сменам",
      children: <Shifts />,
    });
  }
  if (isAllowed("team_time_employee", accesses)) {
    items.push({
      key: "2",
      label: "По сотрудникам",
      children: <Employees />,
    });
  }

  let key = null;

  if (items.length > 0) {
    key = _.last(items).key;
  }

  const [activeKey, setActiveKey] = useState(key);
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
  }, [adding]); // eslint-disable-line react-hooks/exhaustive-deps

  const getUsers = async () => {
    try {
      const { data } = await dispatch(call({ url: "users/all" }));
      dispatch(SET_APP(["users"], data));
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
    dispatch(GET_PLACES());
    getData();
  }, [dataFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  const extra = [];

  if (
    isAllowed("team_time_shift", createAccesses) ||
    isAllowed("team_time_employee", createAccesses)
  ) {
    extra.push(
      <Button key="create" type="primary" onClick={() => setAdding(true)}>
        Создать смену
      </Button>
    );
  }

  return (
    <Layout>
      <PageHeader title="График работы" ghost={false} extra={extra} />
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
          <Tabs onChange={onTabClick} activeKey={activeKey} items={items} />
        </Context.Provider>
      </Content>
    </Layout>
  );
};

export default Screen;
