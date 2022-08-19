import React, { useContext, useRef, useState } from "react";
import {
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
} from "antd";
import { Typography, DatePicker, Row, Col, TimePicker } from "antd";
import InputMask from "react-input-mask";
import moment from "moment";
import { Context } from ".";

const { Title } = Typography;

const Comp = (props) => {
  const context = useContext(Context);
  const { activeKey } = context;

  if (activeKey === "1") return <Discount />;
  else if (activeKey === "2") return <Promocode />;

  return null;
};

const Discount = (props) => {
  const context = useContext(Context);
  const { adding, setAdding } = context;

  const [loading, setLoading] = useState(false);
  const form = useRef();

  const days = moment.weekdaysShort(true);

  return (
    <Modal
      title="Создать"
      visible={adding}
      okText="Сохранить"
      onCancel={() => setAdding(false)}
      destroyOnClose={true}
    >
      <Form layout="vertical" ref={form}>
        <Form.Item
          label="Наименование"
          name="name"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Input disabled={loading} />
        </Form.Item>
        <Form.Item
          label="Скидка"
          name="value"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            disabled={loading}
            min={1}
            addonAfter="%"
          />
        </Form.Item>

        <Form.Item
          label="Тип активации"
          name="type"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading}>
            <Select.Option value="test">test</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Скидка распространяется"
          name="restriction"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading}>
            <Select.Option value="test">test</Select.Option>
          </Select>
        </Form.Item>
        <Title level={5}>Ограничения по меню</Title>
        <Form.Item label="Ограничения по меню" name="menu_restriction">
          <Select disabled={loading}>
            <Select.Option value="test">test</Select.Option>
          </Select>
        </Form.Item>
        <Title level={5}>Ограничения по времени</Title>

        <Form.Item
          label="Дни недели"
          name="days"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Checkbox.Group>
            {days.map((d, i) => (
              <Checkbox key={d} value={i}>
                {d}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              label="Время от"
              name="start_at"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <TimePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Время до"
              name="end_at"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <TimePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Title level={5}>Прочее</Title>
        <Form.Item label="Минимальная сумма чека" name="min">
          <InputNumber style={{ width: "100%" }} disabled={loading} min={0} />
        </Form.Item>
        <Form.Item label="Клиенты" name="clients">
          <Select disabled={loading}>
            <Select.Option value="test">test</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Комментарий" name="description">
          <Input.TextArea disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item label="Доступно на торговых точках" name="clients">
          <Select disabled={loading}>
            <Select.Option value="test">test</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Указывать комментарий"
          name="comments_musthave"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Promocode = (props) => {
  const context = useContext(Context);
  const { adding, setAdding } = context;

  const [loading, setLoading] = useState(false);
  const form = useRef();

  return (
    <Modal
      title="Создать"
      visible={adding}
      okText="Сохранить"
      destroyOnClose={true}
      onCancel={() => setAdding(false)}
    >
      <Form layout="vertical" ref={form}>
        <Form.Item
          label="Скидка"
          name="discount"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading} placeholder="Выберите скидку">
            <Select.Option value="test">test</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Актуален до"
          name="due_to"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Комментарий" name="description">
          <Input.TextArea disabled={loading} placeholder="Введите текст" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Comp;
