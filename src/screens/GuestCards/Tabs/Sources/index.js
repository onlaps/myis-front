import React, { useContext, useEffect, useState } from "react";
import { Dropdown, Table, Modal } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { columns } from "./data";
import { useDispatch, useSelector } from "react-redux";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { Context } from "../..";

const { confirm } = Modal;

const Comp = () => {
  const context = useContext(Context);
  const { adding, setAdding, setEditing, activeKey } = context;
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const sources = useSelector((state) => state.app.sources);

  useEffect(() => {
    if (!adding) setEditing(null);
  }, [adding]); // eslint-disable-line react-hooks/exhaustive-deps

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await dispatch(call({ url: "sources" }));
      dispatch(SET_APP(["sources"], data));
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
      await dispatch(call({ url: `sources/${id}`, method: "DELETE" }));
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
        dataSource={sources}
        loading={loading}
        pagination={false}
      />
    </>
  );
};

export default Comp;
