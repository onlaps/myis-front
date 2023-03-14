import React from "react";
import { Modal } from "antd";
import { call } from "@/actions/axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Table } from "../NewGuest";

const Move = (props) => {
  const { visible, setVisible, guest, setGuest } = props;
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState(null);

  const dispatch = useDispatch();

  const onOk = async () => {
    try {
      setLoading(true);

      const values = { guest, table: selected };

      await dispatch(
        call({ url: `guests/move`, method: "POST", data: values })
      );
      setGuest(null);
      setLoading(false);
      setVisible(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="Переместить гостя"
        open={visible}
        zIndex={1001}
        onOk={onOk}
        onCancel={() => setVisible(false)}
        okButtonProps={{ loading }}
        cancelButtonProps={{ loading }}
        width={800}
      >
        <Table
          setSelected={setSelected}
          selected={selected}
          loading={loading}
        />
      </Modal>
    </>
  );
};

export default Move;
