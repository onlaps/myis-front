import React from "react";
import { Modal, Input, Typography } from "antd";
import { call } from "@/actions/axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect } from "react";

const { Text } = Typography;
const { Search } = Input;

const Promocode = (props) => {
  const { visible, setVisible, promocode, setPromocode, setDiscount } = props;
  const [loading, setLoading] = useState(false);

  const [text, setText] = useState(null);
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);

  const current_place = useSelector((state) => state.app.current_place);

  const dispatch = useDispatch();

  const onOk = () => {
    setVisible(false);
    if (value) {
      setPromocode(value);
      setDiscount(value.discount);
    }
  };

  useEffect(() => {
    if (visible) {
      if (promocode) {
        setValue(promocode);
      }
    } else {
      setText(null);
      setValue(null);
      setMessage(null);
    }
  }, [visible, promocode]);

  const onChange = (e) => {
    setText(e.target.value);
    setValue(null);
    setMessage(null);
  };

  const onSearch = async () => {
    try {
      if (!text) return;
      setLoading(true);
      setValue(null);
      setMessage(null);

      const { data } = await dispatch(
        call({ url: `promocodes/find?text=${text}` })
      );
      if (!data) {
        setMessage("Промокод не найден");
        return setLoading(false);
      }
      const isAfter = dayjs().isAfter(dayjs(data.due_to));

      if (isAfter) {
        setMessage("Промокод просрочен");
        return setLoading(false);
      }

      const place =
        data.discount.places.map((o) => o._id).indexOf(current_place._id) !==
        -1;

      if (!place) {
        setMessage("Данная скидка недействительна на данной точке");
        return setLoading(false);
      }

      setValue(data);
      setLoading(false);
    } catch (e) {
      console.log(e.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="Поиск промокода"
        open={visible}
        zIndex={1001}
        onOk={onOk}
        onCancel={() => setVisible(false)}
      >
        <Search
          placeholder="Введите промокод"
          loading={loading}
          value={text}
          onChange={onChange}
          enterButton="Искать"
          onSearch={onSearch}
        />
        {message ? (
          <Text type="warning">{message}</Text>
        ) : (
          value && (
            <Text type="success">
              {value.discount.name} ({value.discount.discount}%)
            </Text>
          )
        )}
      </Modal>
    </>
  );
};

export default Promocode;
