import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal, Form, DatePicker, InputNumber, Radio } from "antd";
import { Context } from ".";
import "./index.less";

const Comp = (props) => {
  const context = useContext(Context);
  const { user, setUser } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();

  useEffect(() => {
    if (form.current && user) {
      form.current.setFieldsValue({ award: "bonus" });
    }
  }, [user]);

  return (
    <Modal
      title={user && user.user}
      visible={!!user}
      okText="Сохранить"
      onCancel={() => setUser(null)}
      destroyOnClose={true}
    >
      <Form layout="vertical" ref={form}>
        <Form.Item label="Выберите тип" name="award">
          <Radio.Group>
            <Radio.Button value="bonus">Бонус</Radio.Button>
            <Radio.Button value="penalty">Штраф</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Расчетный период"
          name="login"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <DatePicker
            disabled={loading}
            picker="month"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Сумма"
          name="value"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber min={0} disabled={loading} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Comp;
