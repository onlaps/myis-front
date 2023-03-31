import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Modal, Select } from "antd";
import { Switch, Button, InputNumber, TimePicker } from "antd";
import { Row, Col, Typography, Space, DatePicker } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Context } from ".";
import { useDispatch, useSelector } from "react-redux";
import { call } from "@/actions/axios";
import { types } from "./Tabs/Expenses/data";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";
import _ from "lodash";
import dayjs from "dayjs";

const { Title } = Typography;

const Comp = (props) => {
  const context = useContext(Context);
  const { activeKey } = context;

  if (activeKey === "1") return <Expenses />;
  else if (activeKey === "2") return <Categories />;

  return null;
};

const Categories = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (form.current) {
      form.current.resetFields();
    }
    if (editing) {
      const values = { ...editing };
      form.current.setFieldsValue(values);
    }
  }, [editing]);

  useEffect(() => {
    if (!adding && form.current) {
      form.current.resetFields();
    }
  }, [adding]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    try {
      setLoading(true);
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({
            url: `expense_categories/${_id}`,
            method: "PATCH",
            data: values,
          })
        );
        dispatch(SET_APP_BY_PARAM(["expense_categories"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `expense_categories`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["expense_categories"], data));
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
      open={adding}
      okText="Сохранить"
      onOk={onSubmit}
      okButtonProps={{ loading }}
      cancelButtonProps={{ loading }}
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
        <Form.Item
          label="Постоянный расход (не переменный)"
          name="type"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="Доступно для указание в отчете кассовой смены"
          name="available_in_shift"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="Обязательный выбор сотрудников"
          name="with_employee"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="Доступно в отчетах"
          name="reported"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Expenses = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();
  const dispatch = useDispatch();

  const expense_categories = useSelector(
    (state) => state.app.expense_categories || []
  );

  const places = useSelector((state) => state.app.places || []);
  const exp_users = useSelector((state) => state.app.exp_users || []);

  useEffect(() => {
    if (form.current) {
      form.current.resetFields();
    }
    if (editing) {
      const values = { ...editing };
      form.current.setFieldsValue(values);
    }
  }, [editing]);

  useEffect(() => {
    if (form.current) {
      if (!adding) {
        form.current.resetFields();
      }
    }
  }, [adding]); //eslint-disable-line

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    const date = dayjs(values.date).format("YYYY-MM-DD");
    const time = dayjs(values.time).format("HH:mm");

    values.date = date;
    values.time = time;

    try {
      setLoading(true);
      const { data } = await dispatch(
        call({ url: `expenses`, method: "POST", data: values })
      );
      dispatch(PUSH_APP(["expenses"], data));
      setAdding(false);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Поступление"
      open={adding}
      okText="Сохранить"
      onOk={onSubmit}
      okButtonProps={{ loading }}
      cancelButtonProps={{ loading }}
      onCancel={() => setAdding(false)}
      width={1000}
    >
      <Form layout="vertical" ref={form}>
        <Title level={5}>Редактирование</Title>
        <Row gutter={20}>
          <Col span={6}>
            <Form.Item
              label="Торговая точка"
              name="place"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <Select disabled={loading}>
                {places &&
                  places.map((v) => (
                    <Select.Option key={v._id} value={v._id}>
                      {v.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label="Дата"
              name="date"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <DatePicker
                disabled={loading}
                format="DD.MM.YYYY"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label="Время"
              name="time"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <TimePicker
                disabled={loading}
                format="HH:mm"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label="Тип оплаты"
              name="type"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <Select disabled={loading}>
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
                  {fields.map((field, index) => (
                    <Row key={index}>
                      <Col span={24}>
                        <Space align="start">
                          <Form.Item
                            {...field}
                            key={`${index} ${field.key} expense_category`}
                            name={[field.name, "expense_category"]}
                            label="Категория"
                            rules={[
                              {
                                required: true,
                                message: "Выберите категорию",
                              },
                            ]}
                          >
                            <Select style={{ width: 250 }} disabled={loading}>
                              {expense_categories &&
                                expense_categories.map((v) => (
                                  <Select.Option key={v._id} value={v._id}>
                                    {v.name}
                                  </Select.Option>
                                ))}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            noStyle
                            shouldUpdate={(pv, cv) => {
                              return (
                                pv.items[field.key]?.expense_category !==
                                cv.items[field.key]?.expense_category
                              );
                            }}
                          >
                            {(v) => {
                              const items = v.getFieldValue("items");
                              const item = items[field.key];
                              const expense_category_id =
                                item?.expense_category;
                              const expense_category = _.find(
                                expense_categories,
                                { _id: expense_category_id }
                              );
                              if (
                                expense_category &&
                                expense_category.with_employee
                              ) {
                                return (
                                  <Form.Item
                                    label="Сотрудник"
                                    {...field}
                                    key={`${index} ${field.key} user`}
                                    name={[field.name, "user"]}
                                  >
                                    <Select
                                      style={{ width: 250 }}
                                      disabled={loading}
                                    >
                                      {exp_users &&
                                        exp_users.map((v) => (
                                          <Select.Option
                                            key={v._id}
                                            value={v._id}
                                          >
                                            {v.name}
                                          </Select.Option>
                                        ))}
                                    </Select>
                                  </Form.Item>
                                );
                              }
                            }}
                          </Form.Item>
                          <Form.Item
                            {...field}
                            key={`${index} ${field.key} total`}
                            label="Сумма"
                            name={[field.name, "total"]}
                            rules={[
                              {
                                required: true,
                                message: "Заполните сумму",
                              },
                            ]}
                          >
                            <InputNumber
                              style={{ width: 150 }}
                              disabled={loading}
                            />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            key={`${index} ${field.key} description`}
                            label="Комментарий"
                            name={[field.name, "description"]}
                          >
                            <Input style={{ width: 250 }} disabled={loading} />
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
