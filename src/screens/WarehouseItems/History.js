import React, { useContext, useEffect, useState } from "react";
import { Modal, Table } from "antd";
import { Context } from "./index";
import { historyColumns } from "./data";

const Comp = (props) => {
  const context = useContext(Context);
  const { history, setHistory } = context;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Modal
      title="История"
      visible={history}
      footer={null}
      onCancel={() => setHistory(false)}
      destroyOnClose={true}
    >
      <Table loading={loading} columns={historyColumns} showHeader={false} />
    </Modal>
  );
};

export default Comp;
