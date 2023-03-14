import React, { useEffect, useState } from "react";
import { Modal, List } from "antd";
import SumPicker from "../../components/SumPicker";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import classNames from "classnames";

const Screen = (props) => {
  const { shiftOpen, setShiftOpen } = props;
  const [loading, setLoading] = useState(false);
  const [prevShift, setPrevShift] = useState(null);
  const [sum, setSum] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const current_place = useSelector((state) => state.app.current_place);

  const onCancel = () => {
    setShiftOpen(false);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const { data } = await dispatch(
          call({ url: `shifts/place/${current_place._id}?closed=true` })
        );
        setLoading(false);
        if (data) setPrevShift(data);
      } catch (e) {
        setLoading(false);
      }
    };
    if (shiftOpen) getData();
  }, [shiftOpen, current_place]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async () => {
    setLoading(true);
    try {
      const values = { place: current_place._id, start_sum: sum };
      const { data } = await dispatch(
        call({ url: `shifts`, method: "POST", data: values })
      );
      dispatch(SET_APP(["current_shift"], data));
      navigate("/cashier/shift");
    } catch (e) {
      setLoading(false);
    }
  };

  const onChange = (value) => setSum(value);

  return (
    <Modal
      okText="Открыть смену"
      open={shiftOpen}
      okButtonProps={{ disabled: loading }}
      cancelButtonProps={{ disabled: loading }}
      onCancel={onCancel}
      destroyOnClose={true}
      onOk={onSubmit}
      title="Сумма в кассе"
    >
      <SumPicker onChange={onChange} loading={loading}>
        {prevShift && (
          <List.Item className="total">
            <List.Item.Meta title="Пред. смена" />
            <div
              className={classNames({
                note_total: true,
                total_lower: prevShift.balance > sum,
                total_higher: prevShift.balance < sum,
              })}
            >{`${prevShift.balance} ₸`}</div>
          </List.Item>
        )}
      </SumPicker>
    </Modal>
  );
};

export default Screen;
