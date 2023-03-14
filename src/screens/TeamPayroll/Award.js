import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal, Form, DatePicker, InputNumber, Select } from "antd";
import { Context } from ".";
import "./index.less";
import { bonus_types } from "./data";
import { call } from "@/actions/axios";
import { SET_APP_BY_PARAM } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import dayjs from "dayjs";

const Comp = (props) => {
  const context = useContext(Context);
  const { user, setUser } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();

  const dispatch = useDispatch();
  const place = useSelector((state) => state.app.place);

  useEffect(() => {
    if (form.current) {
      if (user) {
        form.current.setFieldsValue({ type: "bonus" });
      } else {
        form.current.resetFields();
      }
    }
  }, [user]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    values.date = dayjs(values.date).format("YYYY-MM-DD");
    values.user = user._id;

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
      setUser(false);
      setLoading(false);
    } catch (e) {
      console.log(e.message);
      setLoading(false);
    }
  };

  return (
    <Modal
      title={user && user.user}
      open={!!user}
      okText="Сохранить"
      onCancel={() => setUser(null)}
      onOk={onSubmit}
      okButtonProps={{ loading }}
      cancelButtonProps={{ loading }}
    >
      <Form layout="vertical" ref={form}>
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
          label="Сумма"
          name="value"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber min={0} disabled={loading} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Comp;
