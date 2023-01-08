import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, InputNumber } from "antd";
import { Modal, Select } from "antd";
import { Context } from ".";
import { call } from "@/actions/axios";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";
import { useDispatch } from "react-redux";
import { types } from "./Tabs/Units/data";
import _ from "lodash";

const Comp = (props) => {
  const context = useContext(Context);
  const { activeKey } = context;

  if (activeKey === "1") return <Group />;
  else if (activeKey === "2") return <Unit />;
  else if (activeKey === "3") return <Reason />;

  return null;
};

const Group = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing, activeKey } = context;

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
    if (!adding && form.current) form.current.resetFields();
  }, [adding]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    try {
      setLoading(true);
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({ url: `wh_categories/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["wh_categories"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `wh_categories`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["wh_categories"], data));
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
      visible={adding && activeKey === "1"}
      okText="Сохранить"
      onCancel={() => setAdding(false)}
      onOk={onSubmit}
    >
      <Form layout="vertical" ref={form}>
        <Form.Item
          label="Название"
          name="name"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Unit = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing, activeKey } = context;

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
    if (!adding && form.current) form.current.resetFields();
  }, [adding]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    try {
      setLoading(true);
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({ url: `wh_units/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["wh_units"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `wh_units`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["wh_units"], data));
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
      visible={adding && activeKey === "2"}
      okText="Сохранить"
      onCancel={() => setAdding(false)}
      onOk={onSubmit}
      okButtonProps={{ loading }}
    >
      <Form layout="vertical" ref={form} initialValues={{ type: "1" }}>
        <Form.Item
          label="Название"
          name="name"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item
          label="Тип"
          name="type"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading}>
            {types.map((v) => (
              <Select.Option key={v.value} value={v.value}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(pv, cv) => pv.type !== cv.type}>
          {(v) => {
            const type = v.getFieldValue("type");
            const _type = _.find(types, { value: type });
            return (
              <Form.Item
                label="Значение"
                name="value"
                rules={[{ required: true, message: "Данное поле обязательно" }]}
              >
                <InputNumber
                  disabled={loading}
                  placeholder="Например, 250"
                  addonAfter={_type.unit}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            );
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Reason = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing, activeKey } = context;

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
    if (!adding && form.current) form.current.resetFields();
  }, [adding]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    try {
      setLoading(true);
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({ url: `wh_reasons/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["wh_reasons"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `wh_reasons`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["wh_reasons"], data));
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
      visible={adding && activeKey === "3"}
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
      </Form>
    </Modal>
  );
};

export default Comp;
