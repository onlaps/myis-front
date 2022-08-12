import React, { useContext, useRef, useState } from "react";
import { Form, Input, Modal, Select } from "antd";
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
