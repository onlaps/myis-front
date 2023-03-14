import React, { useContext, useEffect, useState } from "react";
import { Dropdown, Table, Modal, Popover, Button } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { columns, discount_types, types } from "./data";
import { Context } from "../..";
import { call } from "@/actions/axios";
import { GET_PLACES } from "@/actions/api";
import { SET_APP } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

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
  const discounts = useSelector((state) => state.app.discounts || []);

  useEffect(() => {
    if (activeKey === "1") {
      dispatch(GET_PLACES());
      getData();
    }
  }, [activeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await dispatch(call({ url: `discounts` }));
      dispatch(SET_APP(["discounts"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await dispatch(call({ url: `discounts/${id}`, method: "DELETE" }));
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
    type: {
      render: (value) => {
        return _.find(types, { value }).name;
      },
    },
    discount_type: {
      render: (value) => {
        return _.find(discount_types, { value }).name;
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

  return (
    <>
      <Table
        columns={columns(options)}
        // onChange={onChange}
        rowKey="_id"
        dataSource={discounts}
        loading={loading}
        pagination={false}
      />
    </>
  );
};

export default Comp;
