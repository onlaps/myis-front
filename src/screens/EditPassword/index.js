import React, { createContext, useRef, useState } from "react";
import { Layout, Button, Input, Form } from "antd";
import { PageHeader, Card, notification } from "antd";
import { call } from "@/actions/axios";
import { useDispatch } from "react-redux";

export const Context = createContext();
const { Content } = Layout;

const Screen = (props) => {
  const [loading, setLoading] = useState(false);
  const form = useRef();

  const dispatch = useDispatch();

  const onFinish = async () => {
    const values = await form.current.validateFields();

    const { password_confirm, password } = values;

    if (password !== password_confirm) {
      return notification.error({
        message: "Ошибка",
        description: "Пароли не совпадают",
      });
    }

    try {
      setLoading(true);
      await dispatch(
        call({ url: `users/change_password`, method: "POST", data: values })
      );
      form.current.resetFields();
      notification.success({
        message: "Успешно",
        description: "Пароль успешно изменен!",
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <>
      <Layout>
        <PageHeader title="Сменить пароль" ghost={false} />
        <Content className="main__content__layout">
          <Card style={{ width: 400 }}>
            <Form layout="vertical" ref={form}>
              <Form.Item
                label="Пароль"
                name="password"
                rules={[{ required: true, message: "Данное поле обязательно" }]}
              >
                <Input disabled={loading} placeholder="Введите текст" />
              </Form.Item>
              <Form.Item
                label="Повторите пароль"
                name="password_confirm"
                rules={[{ required: true, message: "Данное поле обязательно" }]}
              >
                <Input disabled={loading} placeholder="Введите текст" />
              </Form.Item>
              <Form.Item>
                <Button loading={loading} type="primary" onClick={onFinish}>
                  Сохранить
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Content>
      </Layout>
    </>
  );
};

export default Screen;
