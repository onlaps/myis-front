import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, DatePicker, Form, Modal, Select } from "antd";
import { TimePicker, InputNumber, Row, Col } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Context } from ".";
import { call } from "@/actions/axios";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import moment from "moment";

const { confirm } = Modal;

const Comp = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();

  const places = useSelector((state) => state.app.places || []);
  const users = useSelector((state) => state.app.users || []);

  const dispatch = useDispatch();

  useEffect(() => {
    if (form.current) {
      form.current.resetFields();
    }
    if (editing) {
      const values = { ...editing };
      values.date = moment(values.date);
      let hour, minute;
      [hour, minute] = values.time_from.split(":");
      const time_from = moment().set({ hour, minute });
      values.time_from = time_from;
      [hour, minute] = values.time_to.split(":");
      const time_to = moment().set({ hour, minute });
      values.time_to = time_to;
      form.current.setFieldsValue(values);
    }
  }, [editing]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    if (_.isEmpty(values.place)) values.place = null;
    else values.place = values.place._id;

    if (_.isEmpty(values.user)) values.user = null;
    else values.user = values.user._id;

    values.date = moment(values.date).format("YYYY-MM-DD");
    values.time_from = moment(values.time_from).format("HH:mm");
    values.time_to = moment(values.time_to).format("HH:mm");

    try {
      setLoading(true);
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({ url: `schedules/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["schedules"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `schedules`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["schedules"], data));
        setAdding(false);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onDelete = () => {
    confirm({
      title: "Вы уверены?",
      icon: <ExclamationCircleOutlined />,
      content: "Данное действие невозможно отменить!",
      async onOk() {
        const id = editing._id;
        try {
          setLoading(true);
          await dispatch(call({ url: `schedules/${id}`, method: "DELETE" }));
          setAdding(false);
          setLoading(false);
        } catch (e) {
          setLoading(false);
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <Modal
      title="Создать"
      visible={adding}
      okText="Сохранить"
      onCancel={() => setAdding(false)}
      onOk={onSubmit}
      footer={[
        <Button onClick={onDelete} key="delete" type="danger">
          Удалить
        </Button>,
        <Button onClick={() => setAdding(false)} key="cancel">
          Отмена
        </Button>,
        <Button onClick={onSubmit} key="ok" type="primary">
          Сохранить
        </Button>,
      ]}
      okButtonProps={{ loading }}
    >
      <Form layout="vertical" ref={form}>
        <Form.Item
          label="Торговая точка"
          name={["place", "_id"]}
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading}>
            {places.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Сотрудник"
          name={["user", "_id"]}
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading}>
            {users.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Дата"
          name="date"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <DatePicker
            disabled={loading}
            style={{ width: "100%" }}
            format="DD.MM.YYYY"
          />
        </Form.Item>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              label="Время от"
              name="time_from"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <TimePicker
                style={{ width: "100%" }}
                format="HH:mm"
                minuteStep={15}
                disabled={loading}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Время до"
              name="time_to"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <TimePicker
                style={{ width: "100%" }}
                format="HH:mm"
                minuteStep={15}
                disabled={loading}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Номер смены"
          name="shift_number"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <InputNumber min={1} disabled={loading} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Comp;
