import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Modal } from "antd";
import { call } from "@/actions/axios";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";
import { useDispatch } from "react-redux";
import { Context } from ".";

const Comp = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();

  useEffect(() => {
    if (editing && form.current) {
      form.current.setFieldsValue({ ...editing, password: "++++++" });
    }
  }, [editing]);

  const dispatch = useDispatch();

  const onSubmit = async () => {
    const values = await form.current.validateFields();
    try {
      setLoading(true);
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({ url: `places/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["places"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `places`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["places"], data));
        setAdding(false);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Создать"
      visible={adding}
      okText="Сохранить"
      onCancel={() => setAdding(false)}
      okButtonProps={{ loading }}
      onOk={onSubmit}
      loading={loading}
    >
      <Form layout="vertical" ref={form}>
        <Form.Item
          label="Наименование"
          name="name"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item label="Город" name="city">
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item label="Адрес" name="address">
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item label="Телефон" name="phone">
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Comp;
