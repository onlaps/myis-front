import React, { useContext, useEffect, useRef, useState } from "react";
import { Col, Form, Input, InputNumber, Modal, Radio, Row } from "antd";
import { notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { call } from "@/actions/axios";
import { PUSH_APP } from "@/actions/app";
import { Context } from ".";
import { useNavigate } from "react-router";

const types = [
  { label: "Внесение", value: "in" },
  { label: "Изъятие", value: "out" },
];

const Create = (props) => {
  const { type, setType } = useContext(Context);

  const current_place = useSelector((state) => state.app.current_place);
  const current_shift = useSelector((state) => state.app.current_shift);

  const [loading, setLoading] = useState(false);
  const form = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (form.current) {
      form.current.resetFields();
    }
  }, []);

  useEffect(() => {
    if (form.current) {
      if (!type) form.current.resetFields();
      else {
        form.current.setFieldsValue({ type });
      }
    }
  }, [type]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    if (!current_place || !current_shift) {
      navigate("/");
      return notification.error({
        title: "Ошибка",
        description: "Неизвестная ошибка!",
      });
    }

    values.place = current_place._id;
    values.shift = current_shift._id;

    try {
      setLoading(true);
      const { data } = await dispatch(
        call({ url: `shift_cash`, method: "POST", data: values })
      );
      dispatch(PUSH_APP(["shift_cash"], data));
      setType(null);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Создать"
      visible={!!type}
      okText="Сохранить"
      onCancel={() => setType(false)}
      onOk={onSubmit}
    >
      <Form layout="vertical" ref={form}>
        <Row gutter={20}>
          <Col span={24}>
            <Form.Item name="type">
              <Radio.Group
                disabled={loading}
                options={types}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Сумма"
              name="amount"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <InputNumber
                disabled={loading}
                placeholder="Введите текст"
                style={{ width: "100%" }}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Комментарий" name="description">
              <Input disabled={loading} placeholder="Введите текст" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Create;
