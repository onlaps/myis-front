import React, { useContext, useEffect, useState } from "react";
import { Dropdown, Table, Modal } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { columns } from "./data";
import { Context } from "../..";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";

const { confirm } = Modal;

const Comp = () => {
  const context = useContext(Context);
  const { setAdding, setEditing, activeKey } = context;
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const checklist_categories = useSelector(
    (state) => state.app.checklist_categories || []
  );

  useEffect(() => {
    if (activeKey === "2") {
      getDiscounts();
      getData();
    }
  }, [activeKey]); //eslint-disable-line

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await dispatch(call({ url: `checklist_categories` }));
      dispatch(SET_APP(["checklist_categories"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getDiscounts = async () => {
    try {
      const { data } = await dispatch(call({ url: `checklist_categories` }));
      dispatch(SET_APP(["checklist_categories"], data));
    } catch (e) {}
  };

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await dispatch(
        call({ url: `checklist_categories/${id}`, method: "DELETE" })
      );
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
  };

  return (
    <>
      <Table
        columns={columns(options)}
        rowKey="_id"
        dataSource={checklist_categories}
        loading={loading}
        pagination={false}
      />
    </>
  );
};

export default Comp;
