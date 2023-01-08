import React, { createContext, useEffect, useState } from "react";
import { Layout, Button, PageHeader, Table, Switch, Dropdown } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Menu, Modal } from "antd";
import { columns } from "./data";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import Create from "./Create";
import { useDispatch, useSelector } from "react-redux";

export const Context = createContext();
const { Content } = Layout;
const { confirm } = Modal;

const Screen = (props) => {
  const [adding, setAdding] = useState(false);
  const [pagination, setPagination] = useState(null);
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

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await dispatch(call({ url: "users" }));
      dispatch(SET_APP(["users"], data));
      setLoading(false);
    } catch (e) {
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

  const getPlaces = async () => {
    try {
      const { data } = await dispatch(call({ url: "places" }));
      dispatch(SET_APP(["places"], data));
    } catch (e) {}
  };

  useEffect(() => {
    getRoles();
    getSalaries();
    getPlaces();
    getData();
  }, []);

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

  const menu = (item) => (
    <Menu
      onClick={onClick(item)}
      items={[
        {
          key: "1",
          label: "Редактировать",
        },
        {
          key: "2",
          label: "Удалить",
        },
      ]}
    />
  );

  const onUpdate = async (id, values) => {
    try {
      setLoading(true);
      await dispatch(
        call({ url: `users/${id}`, method: "PATCH", data: values })
      );
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const options = {
    status: {
      render: (val, item) => (
        <Switch
          checked={val}
          onChange={(v) => onUpdate(item._id, { status: v })}
        />
      ),
    },
    actions: {
      render: (_, item) => {
        return (
          <Dropdown overlay={menu(item)}>
            <EllipsisOutlined />
          </Dropdown>
        );
      },
    },
  };

  return (
    <>
      <Context.Provider value={{ adding, setAdding, editing }}>
        <Create />
        <Layout>
          <PageHeader
            title="Сотрудники"
            ghost={false}
            extra={[
              <Button
                key="create"
                type="primary"
                onClick={() => setAdding(true)}
              >
                Создать
              </Button>,
            ]}
          />
          <Content className="main__content__layout">
            <Table
              columns={columns(options, filters, sorter)}
              onChange={onChange}
              rowKey="_id"
              dataSource={users}
              loading={loading}
              pagination={false}
            />
          </Content>
        </Layout>
      </Context.Provider>
    </>
  );
};

export default Screen;
