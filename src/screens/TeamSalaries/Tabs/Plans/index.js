import React, { useContext, useEffect, useState } from "react";
import { Table, Popover, Button, Dropdown } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { columns } from "./data";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { Context } from "../..";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import useAccesses from "@/hooks/useAccesses";
import { isAllowed } from "@/utils";

const { confirm } = Modal;

const Screen = () => {
  const editAccesses = useAccesses(["edit"]);
  const deleteAccesses = useAccesses(["delete"]);
  const { activeKey, setEditing, setAdding } = useContext(Context);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const plans = useSelector((state) => state.app.plans);

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await dispatch(call({ url: "plans" }));
      dispatch(SET_APP(["plans"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeKey === "2") {
      getData();
    }
  }, [activeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await dispatch(call({ url: `plans/${id}`, method: "DELETE" }));
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
      disabled: !isAllowed("team_salary_plans", editAccesses),
    },
    {
      key: "2",
      label: "Удалить",
      disabled: !isAllowed("team_salary_plans", deleteAccesses),
    },
  ];

  const options = {
    date: {
      render: (val) => {
        return dayjs(val).format("MMMM, YYYY");
      },
    },
    salaries: {
      render: (val) => {
        return (
          <Popover
            content={val.map((v) => (
              <div key={v._id}>{v.name}</div>
            ))}
            trigger="hover"
            placement="bottom"
          >
            <Button type="link">Ставки: {val.length}</Button>
          </Popover>
        );
      },
    },
    places: {
      render: (val) => {
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
      },
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

  return (
    <>
      <Table
        columns={columns(options)}
        pagination={false}
        rowKey="_id"
        dataSource={plans}
        loading={loading}
      />
    </>
  );
};

export default Screen;
