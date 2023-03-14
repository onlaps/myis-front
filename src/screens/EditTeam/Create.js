import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Modal, Select, Button } from "antd";
import { Context } from ".";
import { call } from "@/actions/axios";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

const Comp = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();

  const navigate = useNavigate();

  const roles = useSelector((state) => state.app.roles || []);
  const salaries = useSelector((state) => state.app.salaries || []);
  const places = useSelector((state) => state.app.places || []);

  const dispatch = useDispatch();

  useEffect(() => {
    if (form.current) {
      if (editing) {
        const values = { ...editing, password: "++++++" };
        if (values.salary) values.salary = values.salary._id;
        form.current.setFieldsValue(values);
      } else {
        form.current.resetFields();
      }
    }
  }, [editing]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    // if (_.isEmpty(values.salary)) values.salary = null;
    // else values.salary = values.salary._id;

    console.log(values);

    // if (_.isEmpty(values.role)) values.role = null;
    // else values.role = values.role._id;

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

  const goTo = (url) => () => {
    navigate(url);
  };

  const loginDisabled = (name, value) => {
    if (loading) return true;

    if (editing && editing[name] === value) {
      return true;
    }

    return false;
  };

  return (
    <Modal
      title="Создать"
      open={adding}
      okText="Сохранить"
      okButtonProps={{ loading }}
      cancelButtonProps={{ loading }}
      onCancel={() => setAdding(false)}
      onOk={onSubmit}
    >
      <Form layout="vertical" ref={form}>
        <Form.Item
          label="Имя пользователя"
          name="login"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Input
            disabled={loginDisabled("login", "admin")}
            placeholder="Введите текст"
          />
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
          <Input
            disabled={loginDisabled("login", "admin")}
            placeholder="Введите текст"
          />
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
          name="role"
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
        <Form.Item
          label="Ставка зарплаты"
          name="salary"
          extra={
            <Button type="link" onClick={goTo("/team-salary")}>
              Перейти в Ставки по зарплате
            </Button>
          }
        >
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
