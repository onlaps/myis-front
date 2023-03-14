import React, { createContext, useEffect, useState } from "react";
import { Layout, Button, Table, Switch, Dropdown } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { columns } from "./data";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import Create from "./Create";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { types } from "./data";

export const Context = createContext();
const { Content } = Layout;
const { confirm } = Modal;

const Screen = (props) => {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const salaries = useSelector((state) => state.app.salaries);

  useEffect(() => {
    if (!adding) setEditing(null);
  }, [adding]);

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await dispatch(call({ url: "salaries" }));
      dispatch(SET_APP(["salaries"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await dispatch(call({ url: `salaries/${id}`, method: "DELETE" }));
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
    },
    {
      key: "2",
      label: "Удалить",
    },
  ];

  const onUpdate = async (id, values) => {
    try {
      setLoading(true);
      await dispatch(
        call({ url: `salaries/${id}`, method: "PATCH", data: values })
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
          <Dropdown menu={{ items, onClick: onClick(item) }}>
            <EllipsisOutlined />
          </Dropdown>
        );
      },
    },
    type: {
      render: (value) => {
        return _.find(types, { value }).text;
      },
    },
  };

  return (
    <>
      <Context.Provider value={{ adding, setAdding, editing }}>
        <Create />
        <Layout>
          <PageHeader
            title="Ставки по зарплате"
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
              columns={columns(options)}
              pagination={false}
              rowKey="_id"
              dataSource={salaries}
              loading={loading}
            />
          </Content>
        </Layout>
      </Context.Provider>
    </>
  );
};

export default Screen;
