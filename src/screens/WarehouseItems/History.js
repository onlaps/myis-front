import React, { useContext, useEffect, useState } from "react";
import { Modal, Table } from "antd";
import { Context } from "./index";
import { historyColumns } from "./data";
import { call } from "@/actions/axios";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

const Comp = (props) => {
  const context = useContext(Context);
  const { history, setHistory, editing } = context;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const dispatch = useDispatch();

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await dispatch(
        call({ url: `wh_actions/${editing._id}` })
      );
      setData(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!editing) setData([]);
  }, [editing]);

  useEffect(() => {
    if (history) getData();
  }, [history]); //eslint-disable-line

  const options = {
    wh_action: {
      render: (val, item) => {
        let text = "";
        if (val.action === "in") text = "Поступление";
        else if (val.action === "out") text = "Списание";
        else if (val.action === "move") text = "Перемещение";

        return <div>{text}</div>;
      },
    },
    createdAt: {
      render: (val) => {
        return dayjs(val).format("DD.MM.YYYY HH:mm");
      },
    },
  };

  return (
    <Modal
      title="История"
      open={history}
      footer={null}
      onCancel={() => setHistory(false)}
      destroyOnClose={true}
      width={700}
    >
      <Table
        columns={historyColumns(options)}
        pagination={false}
        rowKey="_id"
        dataSource={data}
        loading={loading}
      />
    </Modal>
  );
};

export default Comp;
