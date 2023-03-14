import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Modal, Select, Switch } from "antd";
import { DatePicker, InputNumber, Space } from "antd";
import MaskedInput from "antd-mask-input";
import { Context } from ".";
import { call } from "@/actions/axios";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import _ from "lodash";
import dayjs from "dayjs";
import Button from "antd/lib/button";

const Comp = (props) => {
  const context = useContext(Context);
  const { activeKey } = context;

  if (activeKey === "1") return <List />;
  else if (activeKey === "2") return <Sources />;

  return null;
};

const List = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing, setEditing } = context;

  const [loading, setLoading] = useState(false);

  const [isBalancing, setIsBalancing] = useState(false);
  const [increment, setIncrement] = useState(1);

  const form = useRef();
  const balance = useRef();

  const sources = useSelector((state) => state.app.sources || []);

  const dispatch = useDispatch();

  useEffect(() => {
    if (form.current) {
      if (!adding) {
        form.current.resetFields();
      } else {
        if (editing) {
          const values = { ...editing };
          if (values.birthdate) {
            values.birthdate = dayjs(values.birthdate);
          }
          form.current.setFieldsValue(values);
        } else {
          const getNumber = async () => {
            try {
              setLoading(true);
              const values = {
                page: 1,
                limit: 1,
              };
              const query = queryString.stringify(values);
              const { data } = await dispatch(call({ url: `cards?${query}` }));
              form.current.setFieldsValue({ number: data.total + 1 });
              setLoading(false);
            } catch (e) {}
          };
          getNumber();
        }
      }
    }
  }, [editing, adding]); // eslint-disable-line react-hooks/exhaustive-deps

  const onUpdateBalance = async () => {
    const values = await balance.current.validateFields();

    values.balance = increment * values.balance + editing.balance;

    try {
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({ url: `cards/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["cards"], ["_id", _id], data));
        setEditing(data);
        setIsBalancing(false);
        balance.current.resetFields();
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    if (_.isEmpty(values.source)) values.source = null;
    else values.source = values.source._id;

    if (values.birthdate) {
      values.birthdate = dayjs(values.birthdate).format("YYYY-MM-DD");
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

  const onBalance = (increment) => () => {
    setIncrement(increment);
    setIsBalancing(true);
  };

  return (
    <>
      <Modal
        title={increment === 1 ? "Пополнить" : "Списать"}
        open={isBalancing}
        okText="Сохранить"
        onCancel={() => setIsBalancing(false)}
        onOk={onUpdateBalance}
        cancelButtonProps={{ loading }}
        okButtonProps={{ loading }}
      >
        <Form layout="vertical" ref={balance}>
          <Form.Item
            label="Сумма"
            name="balance"
            rules={[{ required: true, message: "Данное поле обязательно" }]}
          >
            <InputNumber
              disabled={loading}
              placeholder="Введите сумму"
              min={1}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
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
            label="Номер карты"
            name="number"
            rules={[{ required: true, message: "Данное поле обязательно" }]}
          >
            <InputNumber disabled={true} placeholder="Введите текст" min={0} />
          </Form.Item>
          <Form.Item label="Баланс">
            <Space>
              <Form.Item name="balance" noStyle>
                <InputNumber
                  disabled={true}
                  placeholder="Введите текст"
                  min={1}
                />
              </Form.Item>
              <Button disabled={loading || !editing} onClick={onBalance(1)}>
                Пополнить
              </Button>
              <Button disabled={loading || !editing} onClick={onBalance(-1)}>
                Списать
              </Button>
            </Space>
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
    </>
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
      open={adding}
      okText="Сохранить"
      onCancel={() => setAdding(false)}
      onOk={onSubmit}
      cancelButtonProps={{ loading }}
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
