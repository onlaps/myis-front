import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Input, InputNumber } from "antd";
import { Modal, notification, Select, Space } from "antd";
import { Row, Col, DatePicker, Typography } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Context } from ".";
import { call } from "@/actions/axios";
import { PUSH_APP } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { types } from "./data";
import _ from "lodash";

const { Title } = Typography;

const Comp = (props) => {
  const context = useContext(Context);
  const { type, setType } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();

  const dispatch = useDispatch();

  const places = useSelector((state) => state.app.places);
  const wh_items = useSelector((state) => state.app.wh_items);
  const wh_units = useSelector((state) => state.app.wh_units || []);

  useEffect(() => {
    if (form.current && !type) {
      form.current.resetFields();
      form.current.resetFields(["items"]);
    }
  }, [type]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    if (!values.items || values.items.length === 0) {
      return notification.warning({
        message: "Отсутствуют позиции",
        description: "Добавьте позиции для сохранения",
      });
    }

    const date = dayjs(values.date).format("YYYY-MM-DD");
    const time = dayjs(values.date).format("HH:mm");

    values.date = date;
    values.time = time;

    try {
      setLoading(true);
      const { data } = await dispatch(
        call({
          url: `wh_actions`,
          method: "POST",
          data: { ...values, action: "in" },
        })
      );
      dispatch(PUSH_APP(["wh_actions"], data));
      setType(null);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onFieldsChange = (field, fields) => {
    const [f] = field;
    const [, index, name] = f.name;

    if (["price", "total", "amount"].indexOf(name) !== -1) {
      let items;
      if (index !== -1) {
        const values = form.current.getFieldsValue();
        items = [...values.items];
      }
      if (name === "price") {
        const amount = _.find(fields, (o) => {
          const name = _.last(o.name);
          return name === "amount";
        });
        const total = amount.value * f.value;
        if (_.isNumber(total) && items) {
          items[index].total = total;

          form.current.setFieldsValue({ items });
        }
      } else if (name === "amount") {
        const price = _.find(fields, (o) => {
          const name = _.last(o.name);
          return name === "price";
        });
        const total = price.value * f.value;
        if (_.isNumber(total) && items) {
          items[index].total = total;

          form.current.setFieldsValue({ items });
        }
      } else if (name === "total") {
        const amount = _.find(fields, (o) => {
          const name = _.last(o.name);
          return name === "amount";
        });
        const price = f.value / amount.value;
        if (_.isNumber(price) && items) {
          items[index].price = price.toFixed(2);

          form.current.setFieldsValue({ items });
        }
      }
    }
  };

  return (
    <Modal
      title="Поступление"
      open={type === "in"}
      okText="Сохранить"
      onCancel={() => setType(null)}
      width={1000}
      onOk={onSubmit}
      cancelButtonProps={{ loading }}
      okButtonProps={{ loading }}
    >
      <Form
        layout="vertical"
        ref={form}
        initialValues={{ type: "1", place: places && places[0]?._id }}
        onFieldsChange={onFieldsChange}
      >
        <Title level={5}>Редактирование</Title>
        <Row gutter={20}>
          <Col span={6}>
            <Form.Item
              label="Торговая точка"
              name="place"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <Select placeholder="Выберите из списка" disabled={loading}>
                {places &&
                  places.map((v) => (
                    <Select.Option key={v._id} value={v._id}>
                      {v.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Дата и время"
              name="date"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <DatePicker
                showTime={{ format: "HH:mm" }}
                disabled={loading}
                format="DD.MM.YYYY HH:mm"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Тип оплаты"
              name="type"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <Select placeholder="Выберите из списка" disabled={loading}>
                {types &&
                  types.map((v) => (
                    <Select.Option key={v.value} value={v.value}>
                      {v.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Комментарий" name="description">
              <Input disabled={loading} placeholder="Введите текст" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Title level={5}>Позиции документа</Title>
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, field }) => (
                    <Row key={key}>
                      <Col span={24}>
                        <Space align="end">
                          <Form.Item
                            {...field}
                            label="Товар"
                            name={[name, "wh_item"]}
                            rules={[
                              {
                                required: true,
                                message: "Выберите товар",
                              },
                            ]}
                          >
                            <Select
                              style={{ width: 130 }}
                              placeholder="Выберите из списка"
                              disabled={loading}
                            >
                              {wh_items.map((v) => (
                                <Select.Option key={v._id} value={v._id}>
                                  {v.name}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            {...field}
                            label="Количество"
                            name={[name, "amount"]}
                            initialValue={0}
                            rules={[
                              {
                                required: true,
                                message: "Заполните количество",
                              },
                            ]}
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              disabled={loading}
                            />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            label="Единица"
                            name={[name, "type"]}
                            rules={[
                              {
                                required: true,
                                message: "Выберите единицу",
                              },
                            ]}
                          >
                            <Select
                              style={{ width: 130 }}
                              placeholder="Выберите из списка"
                              disabled={loading}
                            >
                              {wh_units &&
                                wh_units.map((v) => (
                                  <Select.Option key={v._id} value={v._id}>
                                    {v.name}
                                  </Select.Option>
                                ))}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            {...field}
                            label="Цена"
                            name={[name, "price"]}
                            initialValue={0}
                            rules={[
                              {
                                required: true,
                                message: "Заполните цену",
                              },
                            ]}
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              disabled={loading}
                            />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            label="Сумма"
                            name={[name, "total"]}
                            initialValue={0}
                            rules={[
                              {
                                required: true,
                                message: "Обязательно",
                              },
                            ]}
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              disabled={loading}
                            />
                          </Form.Item>
                          <Form.Item label=" " {...field}>
                            <MinusCircleOutlined
                              onClick={() => remove(name)}
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
                      icon={<PlusOutlined />}
                      disabled={loading}
                    >
                      Добавить позицию
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Comp;
