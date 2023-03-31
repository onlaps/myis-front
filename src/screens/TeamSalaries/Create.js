import React, { useContext, useEffect, useRef, useState } from "react";
import { DatePicker, Form, Input, Modal } from "antd";
import { Row, Col, InputNumber, Select } from "antd";
import { Context } from ".";
import { call } from "@/actions/axios";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import _ from "lodash";

const Comp = () => {
  const context = useContext(Context);
  const { activeKey } = context;

  if (activeKey === "1") return <Salaries />;
  else if (activeKey === "2") return <Plans />;

  return null;
};

const Salaries = () => {
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
      form.current.setFieldsValue(editing);
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
        <Form.Item label="Ставка за час" name="hourly">
          <InputNumber min={0} disabled={loading} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Ставка за смену" name="shiftly">
          <InputNumber min={0} disabled={loading} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Plans = () => {
  const context = useContext(Context);
  const { adding, setAdding, editing } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();

  const dispatch = useDispatch();

  const salaries = useSelector((state) => state.app.salaries || []);
  const places = useSelector((state) => state.app.places || []);

  useEffect(() => {
    if (form.current) {
      form.current.resetFields();
    }
    if (editing) {
      const values = { ...editing };
      if (!_.isEmpty(values.places)) {
        values.places = values.places.map((v) => v._id);
      }
      if (!_.isEmpty(values.salaries)) {
        values.salaries = values.salaries.map((v) => v._id);
      }
      values.date = dayjs(values.date);
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

    values.date = dayjs(values.date).format("YYYY-MM");

    try {
      setLoading(true);
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({ url: `plans/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["plans"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `plans`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["plans"], data));
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
          label="Месяц"
          name="date"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <DatePicker
            disabled={loading}
            picker="month"
            style={{ width: "100%" }}
            format="MMMM, YYYY"
          />
        </Form.Item>
        <Form.Item
          label="Торговые точки"
          name="places"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading} mode="multiple" maxTagCount="responsive">
            {places.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Ставки по зарплатам"
          name="salaries"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading} mode="multiple" maxTagCount="responsive">
            {salaries.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
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

        {/* <Row gutter={20}>
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
        </Row> */}

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

        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Цель заведения за месяц" name="place_goal">
              <InputNumber
                min={0}
                disabled={loading}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Цель заведение за месяц, премия"
              name="place_goal_bonus"
            >
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
