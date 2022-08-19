import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Modal, Checkbox } from "antd";
import { Context } from ".";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";
import { call } from "@/actions/axios";
import { useDispatch, useSelector } from "react-redux";

const Comp = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();

  const accesses = useSelector((state) => state.app.accesses || []);

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
          call({ url: `roles/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["roles"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `roles`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["roles"], data));
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
        <Form.Item
          name="accesses"
          label="Доступные права"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Checkbox.Group>
            {accesses.map((v) => (
              <div key={v._id}>
                <Checkbox disabled={loading} value={v._id}>
                  {v.name}
                </Checkbox>
              </div>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Comp;
