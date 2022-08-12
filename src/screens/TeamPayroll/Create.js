import React, { useContext, useRef, useState } from "react";
import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
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
          label="Сотрудник"
          name="user"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select>
            <Select.Option value="test">test</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Расчетный период"
          name="period"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <DatePicker
            disabled={loading}
            picker="month"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Выберите тип"
          name="type"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select>
            <Select.Option value="test">test</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Значение" name="salary">
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
