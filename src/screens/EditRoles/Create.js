import React, { useContext, useRef, useState } from "react";
import { Form, Input, Modal, Checkbox, Row, Col } from "antd";
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
        <Form.Item
          name="accesses"
          label="Доступные права"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Checkbox.Group>
            {[1, 2].map((value) => (
              <div key={value}>
                <Checkbox value={value}>{value}</Checkbox>
              </div>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Comp;
