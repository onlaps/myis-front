import React, { createContext, useState, useEffect } from "react";
import { Layout, Button, PageHeader, Table, Switch } from "antd";
import { Dropdown, Menu, Modal } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { columns } from "./data";
import { call } from "@/actions/axios";
import Create from "./Create";
import { useDispatch, useSelector } from "react-redux";
import { SET_APP } from "@/actions/app";

export const Context = createContext();
const { Content } = Layout;
const { confirm } = Modal;

const Screen = (props) => {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(null);
  const [sorter, setSorter] = useState(null);

  const onChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilters(filters);
    setSorter({ [sorter.field]: sorter.order });
  };

  const [loading, setLoading] = useState(false);

  const places = useSelector((state) => state.app.places);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!adding) setEditing(null);
  }, [adding]);

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await dispatch(call({ url: "places" }));
      dispatch(SET_APP(["places"], data));
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
        content: "Данное действо невозможно отменить!",
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
      await dispatch(call({ url: `places/${id}`, method: "DELETE" }));
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
        call({ url: `places/${id}`, method: "PATCH", data: values })
      );
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
            title="Торговые точки"
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
              pagination={pagination}
              dataSource={places}
              rowKey="_id"
            />
          </Content>
        </Layout>
      </Context.Provider>
    </>
  );
};

export default Screen;
