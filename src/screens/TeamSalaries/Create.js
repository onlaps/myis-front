import React, { useContext, useEffect, useRef, useState } from "react";
import { Divider, Form, Input, Modal, Select, Switch, Typography } from "antd";
import { Row, Col, InputNumber } from "antd";
import { Context } from ".";
import { call } from "@/actions/axios";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";
import { useDispatch } from "react-redux";

const { Title } = Typography;

const Comp = (props) => {
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
      console.log(editing);
      form.current.setFieldsValue(editing);
    }
  }, [editing]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    try {
      setLoading(true);
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({ url: `salaries/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["salaries"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `salaries`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["salaries"], data));
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
        <Form.Item
          label="Название"
          name="name"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item label="Ставка за час" name="hourly">
          <InputNumber min={0} disabled={loading} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Ставка за смену" name="shiftly">
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
                    name="revenue_rate"
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
                        name="revenue_rate"
                      >
                        <InputNumber
                          min={0}
                          disabled={loading}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="План" name="revenue_rate_plan">
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
                        name="menu_revenue_rate"
                      >
                        <InputNumber
                          min={0}
                          disabled={loading}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="План" name="menu_revenue_rate_plan">
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
                        name="items_revenue_rate"
                      >
                        <InputNumber
                          min={0}
                          disabled={loading}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="План" name="items_revenue_rate_plan">
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
                  name="revenue_splitting"
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
            <Form.Item label="Сотрудник за месяц, план" name="user_plan">
              <InputNumber
                min={0}
                disabled={loading}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Сотрудник за месяц, премия" name="user_bonus">
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
            <Form.Item label="Заведение за месяц, план" name="place_plan">
              <InputNumber
                min={0}
                disabled={loading}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Заведение за месяц, премия" name="place_bonus">
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
