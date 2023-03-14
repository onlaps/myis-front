import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Modal, Select } from "antd";
import { Context } from ".";
import { call } from "@/actions/axios";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

const Comp = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();

  const dispatch = useDispatch();

  const wh_categories = useSelector((state) => state.app.wh_categories || []);
  const wh_units = useSelector((state) => state.app.wh_units || []);

  useEffect(() => {
    if (adding) {
      if (form.current) {
        form.current.resetFields();
      }
      if (editing) {
        const values = { ...editing };
        values.wh_unit = values.wh_unit._id;

        form.current.setFieldsValue(values);
      }
    }
  }, [editing, adding]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    if (_.isEmpty(values.wh_category)) values.wh_category = null;
    else values.wh_category = values.wh_category._id;

    try {
      setLoading(true);
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({ url: `wh_items/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["wh_items"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `wh_items`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["wh_items"], data));
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
          label="Группа"
          name={["wh_category", "_id"]}
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading} placeholder="Выберите группу">
            {wh_categories.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Название"
          name="name"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Form.Item
          label="Единицы по умолчанию"
          name="wh_unit"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select disabled={loading} placeholder="Выберите единицу">
            {wh_units.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Комментарий" name="description">
          <Input.TextArea disabled={loading} placeholder="Введите текст" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Comp;
