import React from "react";
import { Modal, Select } from "antd";
import { call } from "@/actions/axios";
import _ from "lodash";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

const Reassign = (props) => {
  const { visible, setVisible, guest, setGuest, selected } = props;
  const [loading, setLoading] = useState(false);

  const [assign, setAssign] = useState(null);
  const guests = useSelector((state) => state.app.guests || []);

  const guestToOption = (guests) => {
    return _.filter(guests, (o) => o.table._id === guest.table._id).map((g) => {
      const { _id, name, assigned } = g;
      return {
        value: _id,
        label: name,
        disabled: _id === guest._id || assigned || selected.indexOf(_id) !== -1,
      };
    });
  };

  const dispatch = useDispatch();

  const onSubmit = async () => {
    try {
      setLoading(true);

      const values = {
        guests: selected,
        assign,
        date: dayjs().format("YYYY-MM-DD HH:mm"),
      };

      await dispatch(
        call({ url: `guests/reassign`, method: "POST", data: values })
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
        title="Записать на другого"
        open={visible}
        zIndex={1001}
        onOk={onSubmit}
        onCancel={() => setVisible(false)}
        okButtonProps={{ loading, disabled: !assign }}
        cancelButtonProps={{ loading }}
      >
        <Select
          style={{ width: "100%" }}
          value={assign}
          options={guestToOption(guests)}
          onChange={(e) => setAssign(e)}
          disabled={loading}
        />
      </Modal>
    </>
  );
};

export default Reassign;
