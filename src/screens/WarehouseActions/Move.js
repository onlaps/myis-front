import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  InputNumber,
  Modal,
  notification,
  Select,
  Space,
} from "antd";
import { Row, Col, DatePicker, Typography } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Context } from "./index";
import { call } from "@/actions/axios";
import { PUSH_APP, SET_APP } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import _ from "lodash";
import queryString from "query-string";

const { Title } = Typography;

const Comp = (props) => {
  const context = useContext(Context);
  const { setType, type } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();

  const dispatch = useDispatch();

  const places = useSelector((state) => state.app.places);
  const wh_items = useSelector((state) => state.app.wh_items);
  const wh_units = useSelector((state) => state.app.wh_units || []);

  useEffect(() => {
    if (form.current && !type) {
      form.current.resetFields();
    }
  }, [type]);

  useEffect(() => {
    if (type === "move") {
      getWhItems({ place: places[0]?._id });
    }
  }, [type, places]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    if (!values.items || values.items.length === 0) {
      return notification.warn({
        message: "Отсутствуют позиции",
        description: "Добавьте позиции для сохранения",
      });
    }

    const date = moment(values.date).format("YYYY-MM-DD");
    const time = moment(values.date).format("HH:mm");

    values.date = date;
    values.time = time;

    try {
      setLoading(true);
      const { data } = await dispatch(
        call({
          url: `wh_actions`,
          method: "POST",
          data: { ...values, action: "move" },
        })
      );
      dispatch(PUSH_APP(["wh_actions"], data));
      setType(null);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getWhItems = async (values) => {
    try {
      const query = queryString.stringify(values);
      const { data } = await dispatch(call({ url: `wh_items?${query}` }));
      dispatch(SET_APP(["wh_items"], data));
    } catch (e) {}
  };

  const onFieldsChange = (field, fields) => {
    const [f] = field;
    const [arr, index, name] = f.name;

    if (["price", "total", "amount", "wh_item"].indexOf(name) !== -1) {
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
      } else if (name === "wh_item") {
        const wh_item = _.find(wh_items, { _id: f.value });

        if (wh_item?.wh_item_prices) {
          const { wh_unit } = wh_item;
          const { price } = wh_item?.wh_item_prices;
          items[index].price = price;
          items[index].type = wh_unit._id;
          form.current.setFieldsValue({ items });
        }
      }
    }
    if (name === "place") {
      getWhItems({ place: f.value });
    }
  };

  return (
    <Modal
      title="Перемещение"
      visible={type === "move"}
      okText="Сохранить"
      onCancel={() => setType(null)}
      width={1000}
      onOk={onSubmit}
      okButtonProps={{ loading }}
    >
      <Form
        layout="vertical"
        ref={form}
        initialValues={{ place: places && places[0]?._id }}
        onFieldsChange={onFieldsChange}
      >
        <Title level={5}>Редактирование</Title>
        <Row gutter={20}>
          <Col span={9}>
            <Form.Item
              label="Из торговой точки"
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
          <Col span={9}>
            <Form.Item
              label="В торговую точку"
              name="place_to"
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
        </Row>
        <Row>
          <Col span={24}>
            <Title level={5}>Позиции документа</Title>
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Row key={index}>
                      <Col span={24}>
                        <Space align="end">
                          <Form.Item
                            {...field}
                            key={`${index} ${field.key} wh_item`}
                            label="Товар"
                            name={[field.name, "wh_item"]}
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
                              {wh_items &&
                                wh_items.map((v) => (
                                  <Select.Option key={v._id} value={v._id}>
                                    {v.name}
                                  </Select.Option>
                                ))}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            {...field}
                            key={`${index} ${field.key} amount`}
                            label="Количество"
                            name={[field.name, "amount"]}
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
                            key={`${index} ${field.key} type`}
                            label="Единица"
                            name={[field.name, "type"]}
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
                              disabled={true}
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
                            key={`${index} ${field.key} price`}
                            label="Цена"
                            name={[field.name, "price"]}
                            rules={[
                              {
                                required: true,
                                message: "Заполните цену",
                              },
                            ]}
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              disabled={true}
                            />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            key={`${index} ${field.key} total`}
                            label="Сумма"
                            name={[field.name, "total"]}
                            rules={[
                              {
                                required: true,
                                message: "Обязательно",
                              },
                            ]}
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              disabled={true}
                            />
                          </Form.Item>
                          <Form.Item label=" " {...field}>
                            <MinusCircleOutlined
                              onClick={() => remove(field.name)}
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
