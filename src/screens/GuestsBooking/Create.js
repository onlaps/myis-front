import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, InputNumber, Modal, Space } from "antd";
import { Button, Checkbox, notification, Select } from "antd";
import { Typography, DatePicker, Row, Col, TimePicker } from "antd";
import { AutoComplete } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import MaskedInput from "antd-mask-input";
import { Context } from ".";
import { call } from "@/actions/axios";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import moment from "moment";

const { Title } = Typography;

const Comp = (props) => {
  const context = useContext(Context);
  const { activeKey } = context;

  if (activeKey === "3") return <Tables />;
  else return <Booking />;
};

const Booking = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing } = context;
  const [search, setSearch] = useState(null);
  const [card, setCard] = useState(null);
  const [place, setPlace] = useState(null);

  const [loading, setLoading] = useState(false);
  const form = useRef();

  const cards = useSelector((state) => state.app.cards || []);
  const rooms = useSelector((state) => state.app.rooms || []);
  const places = useSelector((state) => state.app.places || []);

  const dispatch = useDispatch();

  useEffect(() => {
    if (form.current) {
      form.current.resetFields();
    }
    if (editing) {
      const values = { ...editing };
      values.date = moment(values.date);
      let hour, minute;
      const time = [];
      [hour, minute] = values.time_from.split(":");
      const time_from = moment().set({ hour, minute });
      time.push(time_from);
      [hour, minute] = values.time_to.split(":");
      const time_to = moment().set({ hour, minute });
      time.push(time_to);
      values.time = time;
      if (values.card) {
        setCard(values.card);
        values.card = values.card.number;
      }
      setPlace(values.place._id);
      values.tables = values.tables.map((v) => v._id);
      form.current.setFieldsValue(values);
    }
  }, [editing]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    if (_.isEmpty(values.place)) values.place = null;
    else values.place = values.place._id;

    values.date = moment(values.date).format("YYYY-MM-DD");
    const [from, to] = values.time;
    values.time_from = moment(from).format("HH:mm");
    values.time_to = moment(to).format("HH:mm");

    if (card) {
      values.card = card._id;
    }

    try {
      setLoading(true);
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({ url: `books/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["books"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `books`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["books"], data));
        setAdding(false);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onSelect = (number) => {
    const card = _.find(cards, { number });
    setCard(card);
  };

  useEffect(() => {
    if (card) {
      form.current.setFieldsValue(card);
    }
  }, [card]);

  const onFieldsChange = (fields) => {
    const [field] = fields;
    if (field.name[0] === "card") setCard(null);
    else if (field.name[0] === "place") setPlace(field.value);
  };

  const filteredRooms = _.filter(rooms, { place });

  return (
    <Modal
      title="Создать"
      visible={adding}
      okText="Сохранить"
      onCancel={() => setAdding(false)}
      onOk={onSubmit}
      okButtonProps={{ loading }}
    >
      <Form layout="vertical" ref={form} onFieldsChange={onFieldsChange}>
        <Form.Item
          label="Торговая точка"
          name={["place", "_id"]}
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading}>
            {places.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {place &&
          (filteredRooms.length > 0 ? (
            <Form.Item
              name="tables"
              label="Столы/Места"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <Checkbox.Group>
                {filteredRooms.map((room) => {
                  return (
                    <>
                      <div>
                        <b>{room.name}</b>
                      </div>
                      {room.tables.map((v) => (
                        <div key={v._id}>
                          <Checkbox disabled={loading} value={v._id}>
                            {v.name}
                          </Checkbox>
                        </div>
                      ))}
                    </>
                  );
                })}
              </Checkbox.Group>
            </Form.Item>
          ) : (
            <p>
              <ExclamationCircleOutlined /> Не добавлены столы
            </p>
          ))}
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              label="Дата"
              name="date"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD.MM.YYYY" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Время"
              name="time"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <TimePicker.RangePicker
                style={{ width: "100%" }}
                format="HH:mm"
                minuteStep={15}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Количество гостей"
          name="guests"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber style={{ width: "100%" }} disabled={loading} min={1} />
        </Form.Item>
        <Form.Item label="Сумма предоплаты" name="prepay">
          <InputNumber style={{ width: "100%" }} disabled={loading} min={0} />
        </Form.Item>
        <Title level={5}>Контакты</Title>
        <Form.Item label="Карта гостя" name="card">
          <AutoComplete
            options={_.filter(
              cards,
              (o) => o.number.indexOf(search) !== -1
            ).map((c) => ({ value: c.number }))}
            style={{ width: "100%" }}
            onSelect={onSelect}
            onSearch={(v) => setSearch(v)}
            disabled={loading}
          />
        </Form.Item>
        <Form.Item
          label="Имя"
          name="name"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Input disabled={loading} />
        </Form.Item>
        <Form.Item
          label="Телефон"
          name="phone"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <MaskedInput mask="+7 000 000 00 00" disabled={loading} />
        </Form.Item>
        <Form.Item label="Соц. сети (через запятую)" name="socials">
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item label="Комментарий" name="description">
          <Input.TextArea disabled={loading} placeholder="Введите текст" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Tables = (props) => {
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
      form.current.setFieldsValue(editing);
    }
  }, [editing]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    if (!values.tables.length) {
      return notification.warn({
        message: "Важно",
        description: "Добавьте столики",
      });
    }

    try {
      setLoading(true);
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({ url: `rooms/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["rooms"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `rooms`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["rooms"], data));
        setAdding(false);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Создать"
      visible={adding}
      okText="Сохранить"
      onCancel={() => setAdding(false)}
      onOk={onSubmit}
      okButtonProps={{ loading }}
    >
      <Form layout="vertical" ref={form}>
        <Form.Item name="place">
          <Select
            disabled={!!editing || loading}
            style={{ width: "100%" }}
            placeholder="Выберите из списка"
          >
            {places.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Наименование"
          name="name"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>

        <Title level={5}>Столы</Title>
        <Form.List name="tables">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Row key={index}>
                  <Col span={24}>
                    <Space align="start">
                      <Form.Item
                        {...field}
                        key={`${index} ${field.key} number`}
                        label="Номер"
                        name={[field.name, "number"]}
                        rules={[
                          {
                            required: true,
                            message: "Данное поле обязательно",
                          },
                        ]}
                      >
                        <Input disabled={loading} />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        key={`${index} ${field.key} name`}
                        label="Название"
                        name={[field.name, "name"]}
                        rules={[
                          {
                            required: true,
                            message: "Данное поле обязательно",
                          },
                        ]}
                      >
                        <Input disabled={loading} />
                      </Form.Item>
                      <Form.Item label=" " {...field}>
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                          disabled={loading}
                        />
                      </Form.Item>
                    </Space>
                  </Col>
                </Row>
              ))}

              <Form.Item>
                <Button
                  type="primary"
                  onClick={() => add()}
                  disabled={loading}
                  icon={<PlusOutlined />}
                >
                  Добавить столы
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default Comp;
