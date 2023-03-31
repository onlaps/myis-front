import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Modal, Checkbox } from "antd";
import { Switch, InputNumber } from "antd";
import dayjs from "dayjs";
import { call } from "@/actions/axios";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";
import { useDispatch } from "react-redux";
import { Context } from ".";

const Comp = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();

  const days = dayjs.weekdaysMin(true);

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
      open={adding}
      okText="Сохранить"
      onCancel={() => setAdding(false)}
      onOk={onSubmit}
      cancelButtonProps={{ loading }}
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
        <Form.Item
          label="Стоимость часа"
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
          name="use_min"
          valuePropName="checked"
        >
          <Switch disabled={loading} />
        </Form.Item>
        <Form.Item
          label="Применять скидки к максимуму (иначе максимум остается вне зависимости от наличия скидки)"
          name="use_max"
          valuePropName="checked"
        >
          <Switch disabled={loading} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Comp;
