import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Modal, Select, Checkbox, TimePicker } from "antd";
import { Switch, InputNumber, Row, Col } from "antd";
import moment from "moment";
import { call } from "@/actions/axios";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import { Context } from ".";
import _ from "lodash";

const Comp = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();

  const days = moment.weekdaysShort(true);

  const places = useSelector((state) => state.app.places || []);

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

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    try {
      setLoading(true);
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({ url: `tariffs/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["tariffs"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `tariffs`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["tariffs"], data));
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
        <Form.Item label="Торговые точки" name="places">
          <Select
            allowClear
            disabled={loading}
            placeholder="Доступно для всех точек"
          >
            {places &&
              places.map((v) => (
                <Select.Option key={v._id} value={v._id}>
                  {v.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Дни недели"
          name="days_of_week"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Checkbox.Group>
            {days.map((d, i) => (
              <Checkbox key={d} value={i} disabled={loading}>
                {d}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Время от" name="time_from">
              <TimePicker
                disabled={loading}
                style={{ width: "100%" }}
                placeholder="С открытия"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Время до" name="time_to">
              <TimePicker
                disabled={loading}
                style={{ width: "100%" }}
                placeholder="До закрытия"
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Первый час"
          name="first_hour"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber
            disabled={loading}
            addonAfter="₸/мин"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Второй час"
          name="second_hour"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber
            disabled={loading}
            addonAfter="₸/мин"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Третий час"
          name="third_hour"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber
            disabled={loading}
            addonAfter="₸/мин"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Остальные часы"
          name="hour"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber
            disabled={loading}
            addonAfter="₸/мин"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Минимальный чек"
          name="min"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber
            disabled={loading}
            addonAfter="₸/посещение"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Максимальный чек"
          name="max"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber
            disabled={loading}
            addonAfter="₸/посещение"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Шаг округления"
          name="round"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber disabled={loading} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Применять скидки к минимуму (иначе минимум остается вне зависимости от наличия скидки)"
          name="apply_discount_min"
          valuePropName="checked"
        >
          <Switch disabled={loading} />
        </Form.Item>
        <Form.Item
          label="Применять скидки к максимуму (иначе максимум остается вне зависимости от наличия скидки)"
          name="apply_discount_max"
          valuePropName="checked"
        >
          <Switch disabled={loading} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Comp;
