import React, { createContext, useEffect, useState } from "react";
import { Layout, Button, Table, Switch, Dropdown, notification } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { columns } from "./data";
import { call } from "@/actions/axios";
import { GET_PLACES } from "@/actions/api";
import queryString from "query-string";
import { SET_APP, SET_APP_BY_PARAM } from "@/actions/app";
import Create from "./Create";
import { useDispatch, useSelector } from "react-redux";
import useAccesses from "@/hooks/useAccesses";
import { isAllowed } from "@/utils";

export const Context = createContext();
const { Content } = Layout;
const { confirm } = Modal;

const Screen = (props) => {
  const editAccesses = useAccesses(["edit"]);
  const deleteAccesses = useAccesses(["delete"]);
  const createAccesses = useAccesses(["create"]);
  const [adding, setAdding] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 10,
  });
  const [filters, setFilters] = useState(null);
  const [sorter, setSorter] = useState(null);

  const onChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilters(filters);
    setSorter({ [sorter.field]: sorter.order });
  };

  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const users = useSelector((state) => state.app.users);

  useEffect(() => {
    if (!adding) setEditing(null);
  }, [adding]);

  useEffect(() => {
    getData();
  }, [pagination.current]); // eslint-disable-line react-hooks/exhaustive-deps

  const getData = async () => {
    try {
      setLoading(true);
      const values = {};
      values.page = pagination.current;
      const query = queryString.stringify(values);
      const { data } = await dispatch(call({ url: `users?${query}` }));
      const { data: items, ...p } = data;
      dispatch(SET_APP(["users"], items));
      setPagination(p);
      setLoading(false);
    } catch (e) {
      console.log(e.message);
      setLoading(false);
    }
  };

  const getRoles = async () => {
    try {
      const { data } = await dispatch(call({ url: "roles" }));
      dispatch(SET_APP(["roles"], data));
    } catch (e) {}
  };

  const getSalaries = async () => {
    try {
      const { data } = await dispatch(call({ url: "salaries" }));
      dispatch(SET_APP(["salaries"], data));
    } catch (e) {}
  };

  useEffect(() => {
    dispatch(GET_PLACES());
    getRoles();
    getSalaries();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await dispatch(call({ url: `users/${id}`, method: "DELETE" }));
      await getData();
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onClick = (item) => (e) => {
    if (e.key === "1") {
      setEditing(item);
      setAdding(true);
    } else {
      confirm({
        title: "Вы уверены?",
        icon: <ExclamationCircleOutlined />,
        content: "Данное действие невозможно отменить!",
        onOk() {
          onDelete(item._id);
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    }
  };

  const items = [
    {
      key: "1",
      label: "Редактировать",
      disabled: !isAllowed("edit_users", editAccesses),
    },
    {
      key: "2",
      label: "Удалить",
      disabled: !isAllowed("edit_users", deleteAccesses),
    },
  ];

  const onUpdate = async (item, values) => {
    if (item.login === "admin") {
      return notification.error({
        title: "Запрещено",
        message: "Не возможно применить к администратору",
      });
    }
    const { id } = item;
    try {
      setLoading(true);
      const { data } = await dispatch(
        call({ url: `users/${id}`, method: "PATCH", data: values })
      );
      dispatch(SET_APP_BY_PARAM(["users"], ["_id", id], data));

      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const options = {
    status: {
      render: (val, item) => (
        <Switch checked={val} onChange={(v) => onUpdate(item, { status: v })} />
      ),
    },
    actions: {
      render: (_, item) => {
        return (
          <Dropdown menu={{ items, onClick: onClick(item) }}>
            <EllipsisOutlined />
          </Dropdown>
        );
      },
    },
  };

  const extra = [];

  if (isAllowed("edit_users", createAccesses)) {
    extra.push(
      <Button key="create" type="primary" onClick={() => setAdding(true)}>
        Создать
      </Button>
    );
  }

  return (
    <>
      <Context.Provider value={{ adding, setAdding, editing }}>
        <Create />
        <Layout>
          <PageHeader title="Сотрудники" ghost={false} extra={extra} />
          <Content className="main__content__layout">
            <Table
              columns={columns(options, filters, sorter)}
              onChange={onChange}
              rowKey="_id"
              dataSource={users}
              loading={loading}
              pagination={pagination}
            />
          </Content>
        </Layout>
      </Context.Provider>
    </>
  );
};

export default Screen;
