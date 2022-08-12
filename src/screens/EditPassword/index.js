import React, { createContext, useRef, useState } from "react";
import { Layout, Button, Input, Form, PageHeader, Card } from "antd";

export const Context = createContext();
const { Content } = Layout;

const Screen = (props) => {
  const [loading, setLoading] = useState(false);
  const form = useRef();

  const onFinish = () => false;

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
                <Button type="primary" onClick={onFinish}>
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
