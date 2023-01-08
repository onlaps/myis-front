import React, { useContext, useEffect, useState } from "react";
import { Dropdown, Table, Menu, Modal, Popover, Button } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { columns, types } from "./data";
import { Context } from "../..";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import moment from "moment";

const { confirm } = Modal;

const Comp = () => {
  const context = useContext(Context);
  const { setAdding, setEditing, activeKey } = context;
  const [filters, setFilters] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [sorter, setSorter] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilters(filters);
    setSorter({ [sorter.field]: sorter.order });
  };

  const dispatch = useDispatch();
  const checklists = useSelector((state) => state.app.checklists || []);

  useEffect(() => {
    if (activeKey === "1") {
      getChecklistCategories();
      getPlaces();
      getData();
    }
  }, [activeKey]);

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await dispatch(call({ url: `checklists` }));
      dispatch(SET_APP(["checklists"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getPlaces = async () => {
    try {
      const { data } = await dispatch(call({ url: `places` }));
      dispatch(SET_APP(["places"], data));
    } catch (e) {}
  };

  const getChecklistCategories = async () => {
    try {
      const { data } = await dispatch(call({ url: `checklist_categories` }));
      dispatch(SET_APP(["checklist_categories"], data));
    } catch (e) {}
  };

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await dispatch(call({ url: `checklists/${id}`, method: "DELETE" }));
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
    type: {
      render: (value) => {
        return _.find(types, { value }).name;
      },
    },
    days_of_week: {
      render: (val) => {
        const days = moment.weekdaysShort(true);
        const text = [];
        val.forEach((v) => {
          text.push(days[v - 1]);
        });
        return text.join(", ");
      },
    },
    days_of_month: {
      render: (val) => {
        return val.join(", ");
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
        columns={columns(options, filters, sorter)}
        onChange={onChange}
        rowKey="_id"
        dataSource={checklists}
        loading={loading}
        pagination={false}
      />
    </>
  );
};

export default Comp;
