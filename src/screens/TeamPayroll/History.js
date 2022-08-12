import React, { useContext } from "react";
import { Modal, Table, Button } from "antd";
import { Context } from ".";
import { test, historyColumns } from "./data";
import moment from "moment";
import "./index.less";

const Comp = (props) => {
  const context = useContext(Context);
  const { history, setHistory } = context;

  const onDelete = (id) => () => {};

  const options = {
    type: {
      render: (v) => {
        let className, name;
        if (v === "penalty") {
          className = "penalty";
          name = "Штраф";
        } else {
          className = "bonus";
          name = "Бонус";
        }
        return <div className={className}>{name}</div>;
      },
    },
    date: {
      render: (v) => {
        return moment(v).format("MMM YYYY");
      },
    },
    actions: {
      render: (_, item) => {
        return (
          <Button size="small" type="link" onClick={onDelete(item.id)}>
            Удалить
          </Button>
        );
      },
    },
  };

  return (
    <Modal
      visible={history}
      okText="Сохранить"
      width="50%"
      footer={null}
      onCancel={() => setHistory(false)}
    >
      <Table
        dataSource={test}
        columns={historyColumns(options)}
        showHeader={false}
        pagination={false}
      />
    </Modal>
  );
};

export default Comp;
