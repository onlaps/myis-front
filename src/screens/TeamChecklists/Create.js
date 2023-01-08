import React, { useContext, useEffect, useRef, useState } from "react";
import _ from "lodash";
import { Checkbox, Form, Input, InputNumber } from "antd";
import { Modal, Select, Switch } from "antd";
import { Typography, DatePicker, Row, Col, TimePicker } from "antd";
import moment from "moment";
import { Context } from ".";
import { call } from "@/actions/axios";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import { types } from "./Tabs/Checklists/data";

const { Title } = Typography;

const Comp = (props) => {
  const context = useContext(Context);
  const { activeKey } = context;

  if (activeKey === "1") return <Checklists />;
  else if (activeKey === "2") return <Groups />;

  return null;
};

const Checklists = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing } = context;

  const [loading, setLoading] = useState(false);
  const form = useRef();
  const dispatch = useDispatch();
  const places = useSelector((state) => state.app.places || []);
  const checklist_categories = useSelector(
    (state) => state.app.checklist_categories || []
  );

  useEffect(() => {
    if (form.current) {
      form.current.resetFields();
    }
    if (editing) {
      const values = { ...editing };
      if (!_.isEmpty(values.places)) {
        values.places = values.places.map((v) => v._id);
      }
      if (!_.isEmpty(values.checklist_category)) {
        values.checklist_category = values.checklist_category._id;
      }
      form.current.setFieldsValue(values);
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
          call({ url: `checklists/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["checklists"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `checklists`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["checklists"], data));
        setAdding(false);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const days = moment.weekdaysShort(true);
  const mDays = new Array(31).fill(1);

  return (
    <Modal
      title="Создать"
      visible={adding}
      okText="Сохранить"
      onCancel={() => setAdding(false)}
      onOk={onSubmit}
      okButtonProps={{ loading }}
    >
      <Form
        layout="vertical"
        ref={form}
        initialValues={{
          type: "1",
        }}
      >
        <Form.Item
          label="Группа"
          name="checklist_category"
          rules={[
            {
              required: true,
              message: "Данное поле обязательно",
            },
          ]}
        >
          <Select disabled={loading}>
            {checklist_categories.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Наименование"
          name="name"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Input disabled={loading} />
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
            const text =
              type === "1" ? "Только в первую" : "Только в последнюю";
            return (
              <Form.Item label={text} name="only_type" valuePropName="checked">
                <Switch />
              </Form.Item>
            );
          }}
        </Form.Item>
        <Form.Item label="Дни недели" name="days_of_week">
          <Checkbox.Group>
            {days.map((d, i) => (
              <Checkbox key={d} value={i + 1}>
                {d}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
        <Form.Item label="Дни месяца" name="days_of_month">
          <Select disabled={loading} mode="multiple" maxTagCount="responsive">
            {mDays.map((v, i) => (
              <Select.Option key={i + 1} value={i + 1}>
                {i + 1}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Доступно на торговых точках" name="places">
          <Select disabled={loading} mode="multiple" maxTagCount="responsive">
            {places.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Groups = (props) => {
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
    if (!adding && form.current) form.current.resetFields();
  }, [adding]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    try {
      setLoading(true);
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({
            url: `checklist_categories/${_id}`,
            method: "PATCH",
            data: values,
          })
        );
        dispatch(
          SET_APP_BY_PARAM(["checklist_categories"], ["_id", _id], data)
        );
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `checklist_categories`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["checklist_categories"], data));
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
      </Form>
    </Modal>
  );
};

export default Comp;
