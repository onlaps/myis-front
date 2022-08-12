import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Form, Input, Button } from "antd";
import { Layout, Row, Col } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { SET_APP } from "@/actions/app";
import "./index.less";

const { Content } = Layout;

const Screen = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const form = useRef();

  const [loading, setLoading] = useState(false);

  const onFinish = async () => {
    setLoading(true);
    const values = await form.current.validateFields();

    const { login, password } = values;

    if (login === "test" && password === "test") {
      setTimeout(() => {
        setLoading(true);
        dispatch(SET_APP(["user"], { login: "test" }));
        navigate("/");
      }, 1000);
    }
  };

  return (
    <Content className="login__background">
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={{ minHeight: "100vh" }}
      >
        <Col span={4} className="login__form">
          <Form onFinish={onFinish} ref={form}>
            <Form.Item
              name="login"
              rules={[{ required: true, message: "Введите логин" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Логин"
                disabled={loading}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Введите пароль" }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Пароль"
                disabled={loading}
              />
            </Form.Item>
            <Form.Item>
              <Button disabled={loading} type="primary" htmlType="submit" block>
                Войти
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
};

export default Screen;
