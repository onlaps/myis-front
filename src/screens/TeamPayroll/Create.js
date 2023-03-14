import React, { useContext, useEffect, useRef, useState } from "react";
import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import { Context } from ".";
import { call } from "@/actions/axios";
import { SET_APP, SET_APP_BY_PARAM } from "@/actions/app";
import { bonus_types } from "./data";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import dayjs from "dayjs";

const Comp = (props) => {
  const context = useContext(Context);
  const { adding, setAdding } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();

  const dispatch = useDispatch();

  const user_bonuses = useSelector((state) => state.app.user_bonuses || []);
  const place = useSelector((state) => state.app.place);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await dispatch(call({ url: `users/all` }));
        dispatch(SET_APP(["user_bonuses"], data));
      } catch (e) {}
    };
    if (adding) {
      getUsers();
    }
  }, [adding]); //eslint-disable-line

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    values.date = dayjs(values.date).format("YYYY-MM-DD");

    try {
      setLoading(true);
      await dispatch(
        call({ url: `user_bonuses`, method: "POST", data: values })
      );

      const query = queryString.stringify({ place });

      const { data } = await dispatch(
        call({ url: `users/salaries/count/${values.user}?${query}` })
      );

      dispatch(SET_APP_BY_PARAM(["user_payrolls"], ["_id", values.user], data));
      setAdding(false);
      setLoading(false);
    } catch (e) {
      console.log(e.message);
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Создать"
      open={adding}
      okText="Сохранить"
      onOk={onSubmit}
      onCancel={() => setAdding(false)}
      cancelButtonProps={{ loading }}
      okButtonProps={{ loading }}
    >
      <Form layout="vertical" ref={form}>
        <Form.Item
          label="Сотрудник"
          name="user"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading}>
            {user_bonuses.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Расчетный период"
          name="date"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <DatePicker
            disabled={loading}
            picker="month"
            style={{ width: "100%" }}
            format="MMMM, YYYY"
          />
        </Form.Item>
        <Form.Item
          label="Выберите тип"
          name="type"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading}>
            {bonus_types.map((v) => (
              <Select.Option key={v.value} value={v.value}>
                {v.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Значение" name="value">
          <InputNumber disabled={loading} min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Комментарий" name="description">
          <Input.TextArea disabled={loading} placeholder="Введите текст" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Comp;
