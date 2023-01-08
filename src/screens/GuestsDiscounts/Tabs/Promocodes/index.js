import React, { useContext, useEffect, useState } from "react";
import _ from "lodash";
import { Button, Dropdown, Popover, Table, Modal, Menu } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { columns } from "./data";
import { Context } from "../..";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

const { confirm } = Modal;

const Comp = () => {
  const context = useContext(Context);
  const { setAdding, setEditing, activeKey } = context;
  // const [filters, setFilters] = useState(null);
  // const [pagination, setPagination] = useState(null);
  // const [sorter, setSorter] = useState(null);
  const [loading, setLoading] = useState(false);

  // const onChange = (pagination, filters, sorter) => {
  //   setPagination(pagination);
  //   setFilters(filters);
  //   setSorter({ [sorter.field]: sorter.order });
  // };

  const dispatch = useDispatch();
  const promocodes = useSelector((state) => state.app.promocodes || []);

  useEffect(() => {
    if (activeKey === "2") {
      getDiscounts();
      getData();
    }
  }, [activeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await dispatch(call({ url: `promocodes` }));
      dispatch(SET_APP(["promocodes"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getDiscounts = async () => {
    try {
      const { data } = await dispatch(call({ url: `discounts` }));
      dispatch(SET_APP(["discounts"], data));
    } catch (e) {}
  };

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await dispatch(call({ url: `promocodes/${id}`, method: "DELETE" }));
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

  const options = {
    actions: {
      render: (_, item) => {
        return (
          <Dropdown overlay={menu(item)}>
            <EllipsisOutlined />
          </Dropdown>
        );
      },
    },
    createdAt: {
      render: (val) => {
        return moment(val).format("DD.MM.YYYY");
      },
    },
    due_to: {
      render: (val) => {
        return moment(val).format("DD.MM.YYYY");
      },
    },
    places: {
      render: (val) => {
        if (!val || _.isEmpty(val)) return "Все точки";
        else {
          return (
            <Popover
              content={val.map((v) => (
                <div>{v.name}</div>
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

  return (
    <>
      <Table
        columns={columns(options)}
        // onChange={onChange}
        rowKey="_id"
        dataSource={promocodes}
        loading={loading}
        pagination={false}
      />
    </>
  );
};

export default Comp;
