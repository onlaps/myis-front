import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Modal, Select } from "antd";
import { Context } from ".";
import { call } from "@/actions/axios";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

const Comp = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();

  const roles = useSelector((state) => state.app.roles || []);
  const salaries = useSelector((state) => state.app.salaries || []);
  const places = useSelector((state) => state.app.places || []);

  const dispatch = useDispatch();

  useEffect(() => {
    if (form.current) {
      form.current.resetFields();
    }
    if (editing) {
      const { places, ...rest } = editing;
      form.current.setFieldsValue({
        ...rest,
        places: places.map((v) => v._id),
        password: "++++++",
      });
    }
  }, [editing]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    if (_.isEmpty(values.salary)) values.salary = null;
    else values.salary = values.salary._id;

    if (_.isEmpty(values.role)) values.role = null;
    else values.role = values.role._id;

    try {
      setLoading(true);
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({ url: `users/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["users"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `users/register`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["users"], data));
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
      okButtonProps={{ loading }}
      onCancel={() => setAdding(false)}
      onOk={onSubmit}
    >
      <Form layout="vertical" ref={form}>
        <Form.Item
          label="Имя пользователя"
          name="login"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Input
            type="password"
            disabled={loading}
            placeholder="Введите текст"
          />
        </Form.Item>
        <Form.Item
          label="ФИО"
          name="name"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item
          label="Торговые точки"
          name="places"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading} mode="multiple" maxTagCount="responsive">
            {places.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Роль"
          name={["role", "_id"]}
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading}>
            {roles.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Ставка зарплаты" name={["salary", "_id"]}>
          <Select disabled={loading}>
            {salaries.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Фиксированная зарплата" name="fixed_salary">
          <Input disabled={loading} />
        </Form.Item>
        <Form.Item label="Комментарий" name="description">
          <Input.TextArea disabled={loading} placeholder="Введите текст" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Comp;
