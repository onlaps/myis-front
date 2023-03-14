import React, { useContext, useEffect, useState } from "react";
import _ from "lodash";
import { Button, Dropdown, Popover, Table, Modal } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { columns } from "./data";
import { Context } from "../..";
import { call } from "@/actions/axios";
import queryString from "query-string";
import { SET_APP } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

const { confirm } = Modal;

const Comp = () => {
  const context = useContext(Context);
  const { setAdding, setEditing, activeKey } = context;
  const [filters, setFilters] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 10,
  });
  const [sorter, setSorter] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilters(filters);
    setSorter({ [sorter.field]: sorter.order });
  };

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
      const values = { page: pagination.current };
      const query = queryString.stringify(values);
      setLoading(true);
      const { data } = await dispatch(call({ url: `promocodes?${query}` }));
      const { data: items, ...p } = data;
      dispatch(SET_APP(["promocodes"], items));
      setPagination(p);
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
    createdAt: {
      render: (val) => {
        return dayjs(val).format("DD.MM.YYYY");
      },
    },
    due_to: {
      render: (val) => {
        return dayjs(val).format("DD.MM.YYYY");
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
    description: {
      render: (val) => {
        if (!val) return null;
        return (
          <Popover content={val} trigger="hover" placement="bottom">
            <Button type="link">Посмотреть</Button>
          </Popover>
        );
      },
    },
  };

  return (
    <>
      <Table
        columns={columns(options, filters, sorter)}
        onChange={onChange}
        rowKey="_id"
        dataSource={promocodes}
        loading={loading}
        pagination={pagination}
      />
    </>
  );
};

export default Comp;
