import React, { useContext, useRef, useState } from "react";
import { Form, Input, Modal, Select, Checkbox, TimePicker } from "antd";
import { Switch, InputNumber, Row, Col } from "antd";
import moment from "moment";
import { Context } from ".";

const Comp = (props) => {
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
    >
      <Form layout="vertical" ref={form}>
        <Form.Item
          label="Название"
          name="name"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item label="Торговые точки" name="places">
          <Select>
            <Select.Option value="test">test</Select.Option>
          </Select>
        </Form.Item>
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
            <Form.Item label="Время от" name="start_at">
              <TimePicker style={{ width: "100%" }} placeholder="С открытия" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Время до" name="end_at">
              <TimePicker style={{ width: "100%" }} placeholder="До закрытия" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Первый час"
          name="first_hour"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber
            disabled={loading}
            addonAfter="₸/мин"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Второй час"
          name="second_hour"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber
            disabled={loading}
            addonAfter="₸/мин"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Третий час"
          name="third_hour"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber
            disabled={loading}
            addonAfter="₸/мин"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Остальные часы"
          name="other_hours"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber
            disabled={loading}
            addonAfter="₸/мин"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Минимальный чек"
          name="min"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber
            disabled={loading}
            addonAfter="₸/посещение"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Максимальный чек"
          name="max"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber
            disabled={loading}
            addonAfter="₸/посещение"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Шаг округления"
          name="round"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber disabled={loading} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Использовать минимум даже если у гостя есть бесплатные минуты (иначе при бесплатных минутах минимум действовать не будет)"
          name="use_minimum"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="Применять скидки к минимуму (иначе минимум остается вне зависимости от наличия скидки)"
          name="apply_discount_min"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="Применять скидки к максимуму (иначе максимум остается вне зависимости от наличия скидки)"
          name="apply_discount_max"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Comp;
