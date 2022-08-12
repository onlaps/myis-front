import React, { useContext, useRef, useState } from "react";
import { Divider, Form, Input, Modal, Select, Switch, Typography } from "antd";
import { Row, Col, InputNumber } from "antd";
import { Context } from ".";

const { Title } = Typography;

const Comp = (props) => {
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
        <Form.Item label="Ставка за час" name="hourly_rate">
          <InputNumber min={0} disabled={loading} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Ставка за смену" name="shift_rate">
          <InputNumber min={0} disabled={loading} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Способ расчета" name="type">
          <Select disabled={loading}>
            <Select.Option value="0">Без процента</Select.Option>
            <Select.Option value="1">От всей выручки</Select.Option>
            <Select.Option value="2">От всей выручки сверх плана</Select.Option>

            <Select.Option value="3">
              Отдельно выручки на блюда(тех карты) и товары на продажу сверх
              плана
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(pv, cv) => pv.type !== cv.type}>
          {(v) => {
            const type = v.getFieldValue("type");
            if (type === "1") {
              return (
                <>
                  <Form.Item
                    label="% от выручки на меню и товаров"
                    name="procent_rate"
                  >
                    <InputNumber
                      min={0}
                      disabled={loading}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </>
              );
            } else if (type === "2") {
              return (
                <>
                  <Row gutter={20}>
                    <Col span={12}>
                      <Form.Item
                        label="% от выручки на меню и товаров"
                        name="percent_from_items"
                      >
                        <InputNumber
                          min={0}
                          disabled={loading}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="План" name="earnings_plan">
                        <InputNumber
                          min={0}
                          disabled={loading}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              );
            } else if (type === "3") {
              return (
                <>
                  <Row gutter={20}>
                    <Col span={12}>
                      <Form.Item
                        label="% от выручки меню"
                        name="percent_from_items"
                      >
                        <InputNumber
                          min={0}
                          disabled={loading}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="План" name="earnings_plan_menu">
                        <InputNumber
                          min={0}
                          disabled={loading}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={20}>
                    <Col span={12}>
                      <Form.Item
                        label="% от выручки товаров"
                        name="percent_from_items"
                      >
                        <InputNumber
                          min={0}
                          disabled={loading}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="План" name="earnings_plan_items">
                        <InputNumber
                          min={0}
                          disabled={loading}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              );
            }
          }}
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(pv, cv) => pv.type !== cv.type}>
          {(v) => {
            const type = v.getFieldValue("type");
            if (type !== "0") {
              return (
                <Form.Item
                  valuePropName="checked"
                  label="Выручка делится между сотрудниками, если в смене несколько чел."
                  name="dividing"
                >
                  <Switch />
                </Form.Item>
              );
            }
          }}
        </Form.Item>
        <Divider />
        <Title level={5}>Выручка</Title>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Смена, план" name="shift_plan">
              <InputNumber
                min={0}
                disabled={loading}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Смена, премия" name="shift_bonus">
              <InputNumber
                min={0}
                disabled={loading}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Сотрудник за месяц, план" name="shift_plan">
              <InputNumber
                min={0}
                disabled={loading}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Сотрудник за месяц, премия" name="shift_bonus">
              <InputNumber
                min={0}
                disabled={loading}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Заведение за месяц, план" name="shift_plan">
              <InputNumber
                min={0}
                disabled={loading}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Заведение за месяц, премия" name="shift_bonus">
              <InputNumber
                min={0}
                disabled={loading}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Comp;
