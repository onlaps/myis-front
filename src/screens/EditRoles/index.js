import React, { createContext, useEffect, useState } from "react";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Layout, Button, Table } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Switch, Dropdown, Modal } from "antd";
import { columns } from "./data";
import Create from "./Create";
import { useDispatch, useSelector } from "react-redux";
import { SET_APP } from "@/actions/app";
import { call } from "@/actions/axios";
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
  const [editing, setEditing] = useState(null);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const roles = useSelector((state) => state.app.roles);

  useEffect(() => {
    if (!adding) setEditing(null);
  }, [adding]);

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await dispatch(call({ url: "roles" }));
      dispatch(SET_APP(["roles"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getAccesses = async () => {
    try {
      setLoading(true);
      const { data } = await dispatch(call({ url: "accesses" }));
      dispatch(SET_APP(["accesses"], data));
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

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await dispatch(call({ url: `roles/${id}`, method: "DELETE" }));
      await getData();
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onUpdate = async (id, values) => {
    try {
      setLoading(true);
      await dispatch(
        call({ url: `roles/${id}`, method: "PATCH", data: values })
      );
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAccesses();
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const items = [
    {
      key: "1",
      label: "Редактировать",
      disabled: !isAllowed("edit_roles", editAccesses),
    },
    {
      key: "2",
      label: "Удалить",
      disabled: !isAllowed("edit_roles", deleteAccesses),
    },
  ];

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
        if (item.name === "Administrator") return null;
        return (
          <Dropdown menu={{ items, onClick: onClick(item) }}>
            <EllipsisOutlined />
          </Dropdown>
        );
      },
    },
  };

  const extra = [];

  if (isAllowed("edit_roles", createAccesses)) {
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
          <PageHeader title="Роли" ghost={false} extra={extra} />
          <Content className="main__content__layout">
            <Table
              columns={columns(options)}
              dataSource={roles}
              rowKey="_id"
              pagination={false}
              loading={loading}
            />
          </Content>
        </Layout>
      </Context.Provider>
    </>
  );
};

export default Screen;
