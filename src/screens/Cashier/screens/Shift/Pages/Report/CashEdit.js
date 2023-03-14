import React, { useContext, useState } from "react";
import { Modal } from "antd";
import { SumPicker } from "../../../../components";
import { Context } from ".";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";

const Screen = () => {
  const [loading, setLoading] = useState(false);
  const { type, setType } = useContext(Context);
  const [sum, setSum] = useState(0);

  const dispatch = useDispatch();
  const current_shift = useSelector((state) => state.app.current_shift);

  const onCancel = () => {
    setType(null);
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const values = { balance: sum, is_balance: true };
      const { data } = await dispatch(
        call({
          url: `shifts/${current_shift._id}`,
          method: "PATCH",
          data: values,
        })
      );
      setLoading(false);
      dispatch(SET_APP(["current_shift"], data));
      onCancel();
    } catch (e) {
      setLoading(false);
    }
  };

  const onChange = (value) => setSum(value);

  return (
    <Modal
      okText="Сохранить"
      open={type === "cash"}
      okButtonProps={{ disabled: loading }}
      cancelButtonProps={{ disabled: loading }}
      onCancel={onCancel}
      destroyOnClose={true}
      onOk={onSubmit}
      title="Сумма на конец"
    >
      <SumPicker onChange={onChange} loading={loading} />
    </Modal>
  );
};

export default Screen;
