import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Modal, Checkbox, Row, Col } from "antd";
import { Context } from ".";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";
import { call } from "@/actions/axios";
import { useDispatch, useSelector } from "react-redux";

const Comp = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing } = context;
  const [loading, setLoading] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checked, setChecked] = useState(false);
  const form = useRef();

  const accesses = useSelector((state) => state.app.accesses || []);

  const dispatch = useDispatch();

  useEffect(() => {
    if (form.current) {
      if (editing) {
        const role_accesses = editing.accesses.map((a) => a._id);
        setIndeterminate(
          !!role_accesses.length && role_accesses.length < accesses.length
        );
        setChecked(role_accesses.length === accesses.length);
        form.current.setFieldsValue({ ...editing, accesses: role_accesses });
      }
      if (!adding) {
        form.current.resetFields();
      }
    }
  }, [editing, adding, accesses.length]);

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

  const onChange = (e) => {
    const { checked } = e.target;
    setChecked(checked);
    setIndeterminate(false);
    form.current.setFieldsValue({
      accesses: checked ? accesses.map((a) => a._id) : [],
    });
  };

  const onValuesChange = (v) => {
    if (v.accesses) {
      setIndeterminate(
        !!v.accesses.length && v.accesses.length < accesses.length
      );
      setChecked(v.accesses.length === accesses.length);
    }
  };

  return (
    <Modal
      title="Создать"
      open={adding}
      okText="Сохранить"
      onCancel={() => setAdding(false)}
      onOk={onSubmit}
      width={600}
      okButtonProps={{ loading }}
      cancelButtonProps={{ loading }}
    >
      <Form layout="vertical" ref={form} onValuesChange={onValuesChange}>
        <Form.Item
          label="Наименование"
          name="name"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Input disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        <Checkbox
          indeterminate={indeterminate}
          checked={checked}
          onChange={onChange}
        >
          Отметить все доступы
        </Checkbox>
        <br />
        <br />
        <Form.Item
          name="accesses"
          label="Доступные права"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Checkbox.Group style={{ overflowY: "auto", height: 300 }}>
            <Row>
              {accesses.map((v) => (
                <Col span={24} key={v._id}>
                  <Checkbox disabled={loading} value={v._id}>
                    <b>{v.category}</b>, {v.name} - {v.action}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Comp;
