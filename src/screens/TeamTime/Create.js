import React, { useContext, useRef, useState } from "react";
import { DatePicker, Form, Modal, Select } from "antd";
import { TimePicker, InputNumber, Row, Col } from "antd";
import { Context } from ".";

const Comp = (props) => {
  const context = useContext(Context);
  const { adding, setAdding } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();

  return (
    <Modal
      title="Создать"
      visible={adding}
      okText="Сохранить"
      onCancel={() => setAdding(false)}
    >
      <Form layout="vertical" ref={form}>
        <Form.Item
          label="Торговая точка"
          name="place"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading}>
            <Select.Option value="test">test</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Сотрудник"
          name="user"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading}>
            <Select.Option value="test">test</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Дата"
          name="date"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <DatePicker disabled={loading} style={{ width: "100%" }} />
        </Form.Item>
        <Row>
          <Col span={12}>
            <Form.Item
              label="Время от"
              name="time_from"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <TimePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Время до"
              name="time_to"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <TimePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Номер смены"
          name="shift"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber min={1} disabled={loading} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Comp;
