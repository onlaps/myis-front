import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Modal, Select, Switch } from "antd";
import { DatePicker } from "antd";
import MaskedInput from "antd-mask-input";
import { Context } from ".";
import { call } from "@/actions/axios";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import moment from "moment";

const Comp = (props) => {
  const context = useContext(Context);
  const { activeKey } = context;

  if (activeKey === "1") return <List />;
  else if (activeKey === "2") return <Sources />;

  return null;
};

const List = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing } = context;

  const [loading, setLoading] = useState(false);
  const form = useRef();

  const sources = useSelector((state) => state.app.sources || []);

  const dispatch = useDispatch();

  useEffect(() => {
    if (form.current) {
      form.current.resetFields();
    }
    if (editing) {
      const values = { ...editing };
      if (values.birthdate) {
        values.birthdate = moment(values.birthdate);
      }
      form.current.setFieldsValue(values);
    }
  }, [editing]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    if (_.isEmpty(values.source)) values.source = null;
    else values.source = values.source._id;

    if (values.birthdate) {
      values.birthdate = moment(values.birthdate).format("YYYY-MM-DD");
    }

    try {
      setLoading(true);
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({ url: `cards/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["cards"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `cards`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["cards"], data));
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
          label="Номер карты"
          name="number"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item
          label="Телефон"
          name="phone"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <MaskedInput mask="+7 000 000 00 00" />
        </Form.Item>
        <Form.Item
          label="Имя"
          name="name"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item label="Фамилия" name="last_name">
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item label="Дата рождения" name="birthdate">
          <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Пол" name="gender">
          <Select disabled={loading}>
            <Select.Option value="1">Мужчина</Select.Option>
            <Select.Option value="2">Женщина</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Источник" name={["source", "_id"]}>
          <Select disabled={loading}>
            {sources.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item label="Соц. сети (через запятую)" name="socials">
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item label="Комментарий" name="description">
          <Input.TextArea disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item
          label="Согласен на получение рассылок"
          name="subscribed"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Sources = (props) => {
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

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    try {
      setLoading(true);
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({ url: `sources/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["sources"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `sources`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["sources"], data));
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
          label="Наименование"
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
