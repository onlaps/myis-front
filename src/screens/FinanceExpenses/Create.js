import React, { useContext, useRef, useState } from "react";
import { Form, Input, Modal, Select, Switch, Button, InputNumber } from "antd";
import { Row, Col, Typography, Space, DatePicker } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Context } from ".";

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
      </Form>
    </Modal>
  );
};

const Expenses = (props) => {
  const context = useContext(Context);
  const { adding, setAdding } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();

  return (
    <Modal
      title="Поступление"
      visible={adding}
      okText="Сохранить"
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
              <Select>
                <Select.Option value="test">test</Select.Option>
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
              <Select>
                <Select.Option value="test">test</Select.Option>
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
            <Form.List name="positions">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Row key={index}>
                      <Col span={24}>
                        <Space align="start">
                          <Form.Item
                            {...field}
                            key={`${index} ${field.key} category`}
                            label="Категория"
                            name={[field.name, "category"]}
                            rules={[
                              {
                                required: true,
                                message: "Выберите категорию",
                              },
                            ]}
                          >
                            <Select style={{ width: 250 }}>
                              <Select.Option value="test">test</Select.Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            noStyle
                            shouldUpdate={(pv, cv) =>
                              pv.category !== cv.category
                            }
                          >
                            {(v) => {
                              const category = v.getFieldValue("category");
                              if (category === "1") {
                                return (
                                  <Form.Item label="Сотрудник" name="user">
                                    <Select style={{ width: 250 }}>
                                      <Select.Option value="test">
                                        test
                                      </Select.Option>
                                    </Select>
                                  </Form.Item>
                                );
                              }
                            }}
                          </Form.Item>
                          <Form.Item
                            {...field}
                            key={`${index} ${field.key} sum`}
                            label="Сумма"
                            name={[field.name, "sum"]}
                            rules={[
                              {
                                required: true,
                                message: "Заполните сумму",
                              },
                            ]}
                          >
                            <InputNumber style={{ width: 150 }} />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            key={`${index} ${field.key} description`}
                            label="Комментарий"
                            name={[field.name, "description"]}
                          >
                            <Input style={{ width: 250 }} />
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
