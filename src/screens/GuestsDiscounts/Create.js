import React, { useContext, useEffect, useRef, useState } from "react";
import { Checkbox, Form, Input, InputNumber } from "antd";
import { Modal, Select, Switch } from "antd";
import { Typography, DatePicker, Row, Col, TimePicker } from "antd";
import moment from "moment";
import { Context } from ".";
import { call } from "@/actions/axios";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

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
  const { adding, setAdding, editing } = context;

  const [loading, setLoading] = useState(false);
  const form = useRef();
  const dispatch = useDispatch();
  const places = useSelector((state) => state.app.places || []);

  useEffect(() => {
    if (form.current) {
      form.current.resetFields();
    }
    if (editing) {
      const values = { ...editing };
      let hour, minute;
      [hour, minute] = values.time_from.split(":");
      const time_from = moment().set({ hour, minute });
      values.time_from = time_from;
      [hour, minute] = values.time_to.split(":");
      const time_to = moment().set({ hour, minute });
      values.time_to = time_to;
      if (!_.isEmpty(values.places)) {
        values.places = values.places.map((v) => v._id);
      }
      form.current.setFieldsValue(values);
    }
  }, [editing]);

  useEffect(() => {
    if (!adding && form.current) form.current.resetFields();
  }, [adding]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    values.time_from = moment(values.time_from).format("HH:mm");
    values.time_to = moment(values.time_to).format("HH:mm");

    try {
      setLoading(true);
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({ url: `discounts/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["discounts"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `discounts`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["discounts"], data));
        setAdding(false);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const days = moment.weekdaysShort(true);

  return (
    <Modal
      title="Создать"
      visible={adding}
      okText="Сохранить"
      onCancel={() => setAdding(false)}
      onOk={onSubmit}
      okButtonProps={{ loading }}
    >
      <Form
        layout="vertical"
        ref={form}
        initialValues={{
          type: "1",
          discount_type: "1",
          client_type: "1",
          menu_type: "1",
          comment: false,
        }}
      >
        <Form.Item
          label="Наименование"
          name="name"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Input disabled={loading} />
        </Form.Item>
        <Form.Item
          label="Скидка"
          name="discount"
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
            <Select.Option value="1">Выбор вручную</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Скидка распространяется"
          name="discount_type"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading}>
            <Select.Option value="1">На время и меню</Select.Option>
          </Select>
        </Form.Item>
        <Title level={5}>Ограничения по меню</Title>
        <Form.Item
          label="Ограничения по меню"
          name="menu_type"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading}>
            <Select.Option value="1">Без ограничений</Select.Option>
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
              <Checkbox key={d} value={i + 1}>
                {d}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              label="Время от"
              name="time_from"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <TimePicker
                style={{ width: "100%" }}
                format="HH:mm"
                minuteStep={15}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Время до"
              name="time_to"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <TimePicker
                style={{ width: "100%" }}
                format="HH:mm"
                minuteStep={15}
              />
            </Form.Item>
          </Col>
        </Row>
        <Title level={5}>Прочее</Title>
        <Form.Item
          label="Минимальная сумма чека"
          name="min"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber style={{ width: "100%" }} disabled={loading} min={0} />
        </Form.Item>
        <Form.Item
          label="Клиенты"
          name="client_type"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading}>
            <Select.Option value="1">Доступно всем</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Комментарий" name="description">
          <Input.TextArea disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item label="Доступно на торговых точках" name="places">
          <Select disabled={loading} mode="multiple" maxTagCount="responsive">
            {places.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Указывать комментарий"
          name="comment"
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
