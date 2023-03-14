import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Input, InputNumber } from "antd";
import { Modal, notification, Select, Space } from "antd";
import { Row, Col, Typography } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Context } from ".";
import { call } from "@/actions/axios";
import { PUSH_APP, SET_APP } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { types } from "./data";
import _ from "lodash";
import { useNavigate } from "react-router";

const { Title } = Typography;

const Comp = (props) => {
  const context = useContext(Context);
  const { type, setType } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const expense_categories = useSelector(
    (state) => state.app.expense_categories || []
  );

  const exp_users = useSelector((state) => state.app.exp_users || []);

  const current_place = useSelector((state) => state.app.current_place);
  const current_shift = useSelector((state) => state.app.current_shift);

  const getUsers = async () => {
    try {
      const { data } = await dispatch(call({ url: `users/all` }));
      dispatch(SET_APP(["exp_users"], data));
    } catch (e) {}
  };

  useEffect(() => {
    if (form.current) {
      form.current.resetFields();
    }
    if (type === "exp") {
      getExpenseCategories();
      getUsers();
    }
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  const getExpenseCategories = async () => {
    try {
      const { data } = await dispatch(call({ url: `expense_categories` }));
      dispatch(SET_APP(["expense_categories"], data));
    } catch (e) {}
  };

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    if (!values.items || values.items.length === 0) {
      return notification.warning({
        message: "Отсутствуют позиции",
        description: "Добавьте позиции для сохранения",
      });
    }

    const date = dayjs().format("YYYY-MM-DD");
    const time = dayjs().format("HH:mm");

    values.date = date;
    values.time = time;

    if (!current_place || !current_shift) {
      navigate("/");
      return notification.error({
        title: "Ошибка",
        description: "Неизвестная ошибка!",
      });
    }

    values.place = current_place._id;
    values.shift = current_shift._id;

    try {
      setLoading(true);
      const { data } = await dispatch(
        call({ url: `expenses`, method: "POST", data: values })
      );
      dispatch(PUSH_APP(["shift_expenses"], data));
      setType(null);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const filterUsers = (o) => {
    return o.places.indexOf(current_place._id) !== -1;
  };

  return (
    <Modal
      title="Поступление"
      open={type === "exp"}
      okText="Сохранить"
      onCancel={() => setType(null)}
      width={1000}
      onOk={onSubmit}
      okButtonProps={{ loading }}
    >
      <Form layout="vertical" ref={form} initialValues={{ type: "1" }}>
        <Title level={5}>Редактирование</Title>
        <Row gutter={20}>
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
                                _.filter(expense_categories, {
                                  available_in_shift: true,
                                }).map((v) => (
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
                              const _id = item?.expense_category;
                              const expense_category = _.find(
                                expense_categories,
                                { _id }
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
                                    rules={[
                                      {
                                        required: true,
                                        message: "Выберите сотрудника",
                                      },
                                    ]}
                                  >
                                    <Select
                                      style={{ width: 250 }}
                                      disabled={loading}
                                    >
                                      {exp_users &&
                                        _.filter(exp_users, filterUsers).map(
                                          (v) => (
                                            <Select.Option
                                              key={v._id}
                                              value={v._id}
                                            >
                                              {v.name}
                                            </Select.Option>
                                          )
                                        )}
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
                      disabled={loading}
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
