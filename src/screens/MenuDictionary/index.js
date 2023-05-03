import React, { createContext, useEffect, useState } from "react";
import { Layout, Button, Table, Popover } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Dropdown, Modal } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { columns } from "./data";
import { call } from "@/actions/axios";
import { GET_PLACES } from "@/actions/api";
import { SET_APP } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import Create from "./Create";
import _ from "lodash";
import useAccesses from "@/hooks/useAccesses";
import { isAllowed } from "@/utils";

const { confirm } = Modal;

export const Context = createContext();
const { Content } = Layout;

const Screen = (props) => {
  const editAccesses = useAccesses(["edit"]);
  const deleteAccesses = useAccesses(["delete"]);
  const createAccesses = useAccesses(["create"]);
  const [adding, setAdding] = useState(false);
  // const [pagination, setPagination] = useState(null);
  // const [filters, setFilters] = useState(null);
  // const [sorter, setSorter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const dispatch = useDispatch();

  // const onChange = (pagination, filters, sorter) => {
  //   setPagination(pagination);
  //   setFilters(filters);
  //   setSorter({ [sorter.field]: sorter.order });
  // };

  const menu_categories = useSelector(
    (state) => state.app.menu_categories || []
  );

  useEffect(() => {
    dispatch(GET_PLACES());
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!adding) setEditing(null);
  }, [adding]);

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await dispatch(call({ url: `menu_categories` }));
      dispatch(SET_APP(["menu_categories"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await dispatch(call({ url: `menu_categories/${id}`, method: "DELETE" }));
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
      disabled: !isAllowed("menu_dictionary", editAccesses),
    },
    {
      key: "2",
      label: "Удалить",
      disabled: !isAllowed("menu_dictionary", deleteAccesses),
    },
  ];

  const options = {
    actions: {
      render: (_, item) => {
        return (
          <Dropdown menu={{ items, onClick: onClick(item) }}>
            <EllipsisOutlined />
          </Dropdown>
        );
      },
    },
    places: {
      render: (val) => {
        if (!val || _.isEmpty(val)) return "Все точки";
        else {
          return (
            <Popover
              content={val.map((v) => (
                <div key={v._id}>{v.name}</div>
              ))}
              trigger="hover"
              placement="bottom"
            >
              <Button type="link">Торговые точки: {val.length}</Button>
            </Popover>
          );
        }
      },
    },
  };

  const extra = [];

  if (isAllowed("menu_dictionary", createAccesses)) {
    extra.push(
      <Button key="create" type="primary" onClick={() => setAdding(true)}>
        Создать
      </Button>
    );
  }

  return (
    <>
      <Context.Provider value={{ adding, setAdding, editing, setEditing }}>
        <Create />
        <Layout>
          <PageHeader title="Справочники" ghost={false} extra={extra} />
          <Content className="main__content__layout">
            <Table
              columns={columns(options)}
              // onChange={onChange}
              rowKey="_id"
              dataSource={menu_categories}
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
