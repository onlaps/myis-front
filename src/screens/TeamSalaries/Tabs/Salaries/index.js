import React, { useContext, useEffect, useState } from "react";
import { Table, Switch, Dropdown } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { columns } from "./data";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { Context } from "../..";
import { useDispatch, useSelector } from "react-redux";
import useAccesses from "@/hooks/useAccesses";
import { isAllowed } from "@/utils";

const { confirm } = Modal;

const Screen = () => {
  const editAccesses = useAccesses(["edit"]);
  const deleteAccesses = useAccesses(["delete"]);
  const { activeKey, setEditing, setAdding } = useContext(Context);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const salaries = useSelector((state) => state.app.salaries);

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
    if (activeKey === "1") {
      getData();
    }
  }, [activeKey]); // eslint-disable-line react-hooks/exhaustive-deps

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
      disabled: !isAllowed("team_salary", editAccesses),
    },
    {
      key: "2",
      label: "Удалить",
      disabled: !isAllowed("team_salary", deleteAccesses),
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
  };

  return (
    <>
      <Table
        columns={columns(options)}
        pagination={false}
        rowKey="_id"
        dataSource={salaries}
        loading={loading}
      />
    </>
  );
};

export default Screen;
