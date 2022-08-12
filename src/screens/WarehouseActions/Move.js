import React, { useContext, useRef, useState } from "react";
import { Button, Form, Input, Modal, Select, Space } from "antd";
import { Row, Col, DatePicker, Typography } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Context } from "./index";

const { Title } = Typography;

const Comp = (props) => {
  const context = useContext(Context);
  const { setType, type } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();

  return (
    <Modal
      title="Перемещение"
      visible={type === "move"}
      okText="Сохранить"
      onCancel={() => setType(null)}
      width={1000}
    >
      <Form layout="vertical" ref={form}>
        <Title level={4}>Редактирование</Title>
        <Row gutter={20}>
          <Col span={9}>
            <Form.Item
              label="Из торговой точки"
              name="place_out"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <Select>
                <Select.Option value="test">test</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item
              label="В торговую точку"
              name="place_in"
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
        </Row>
        <Row>
          <Col span={24}>
            <Title level={4}>Позиции документа</Title>
            <Form.List name="positions">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Row key={index}>
                      <Col span={24}>
                        <Space align="end">
                          <Form.Item
                            {...field}
                            key={`${index} ${field.key} product`}
                            label="Товар"
                            name={[field.name, "product"]}
                            rules={[
                              {
                                required: true,
                                message: "Выберите товар",
                              },
                            ]}
                          >
                            <Select style={{ width: 130 }}>
                              <Select.Option value="test">test</Select.Option>
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
                            <Input />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            key={`${index} ${field.key} value`}
                            label="Единица"
                            name={[field.name, "value"]}
                            rules={[
                              {
                                required: true,
                                message: "Выберите единицу",
                              },
                            ]}
                          >
                            <Select style={{ width: 130 }}>
                              <Select.Option value="test">test</Select.Option>
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
                            <Input />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            key={`${index} ${field.key} sum`}
                            label="Сумма"
                            name={[field.name, "sum"]}
                          >
                            <Input />
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
