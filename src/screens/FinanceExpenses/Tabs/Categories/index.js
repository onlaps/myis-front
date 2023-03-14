import React, { useContext, useEffect, useState } from "react";
import { Dropdown, Table, Modal } from "antd";
import { columns } from "./data";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { useSelector, useDispatch } from "react-redux";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Context } from "../..";

const { confirm } = Modal;

const Comp = () => {
  const { activeKey, setEditing, setAdding } = useContext(Context);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const expense_categories = useSelector(
    (state) => state.app.expense_categories || []
  );

  useEffect(() => {
    if (activeKey === "2") getData();
  }, [activeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await dispatch(call({ url: `expense_categories` }));
      dispatch(SET_APP(["expense_categories"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onDelete = () => {
    dispatch(
      call({
        url: `expense_categories`,
        method: "DELETE",
      })
    );
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
      render: (val) => {
        if (val) return "Постоянный";
        return "Переменный";
      },
    },
    available_in_shift: {
      render: (val) => {
        if (val) return "Да";
        return "Нет";
      },
    },
  };

  return (
    <>
      <Table
        dataSource={expense_categories}
        columns={columns(options)}
        rowKey="_id"
        loading={loading}
        pagination={false}
      />
    </>
  );
};

export default Comp;
