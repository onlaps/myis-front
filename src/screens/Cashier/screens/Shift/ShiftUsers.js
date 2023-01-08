import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Modal, Form, Typography } from "antd";
import { Button, Select, TimePicker, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import moment from "moment";
import _ from "lodash";

const { Title } = Typography;

const ShiftUsers = (props) => {
  const { isClosing, setIsClosing } = props;
  const [loading, setLoading] = useState(false);

  const current_shift = useSelector((state) => state.app.current_shift);
  const current_place = useSelector((state) => state.app.current_place);
  const user = useSelector((state) => state.app.user);
  const users = useSelector((state) => state.app.users);

  const form = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (form.current) {
      form.current.setFieldsValue({
        users: [
          {
            user: user._id,
            time: [moment(current_shift.createdAt), moment()],
          },
        ],
      });
    }
    if (isClosing) {
      const getUsers = async () => {
        try {
          const { data } = await dispatch(call({ url: "users" }));
          dispatch(SET_APP(["users"], data));
        } catch (e) {}
      };
      getUsers();
    }
  }, [isClosing]);

  const onCancel = () => setIsClosing(false);

  const onSubmit = async () => {
    try {
      const values = await form.current.validateFields();
      values.closed = true;

      const shift_users = [];

      for (let i = 0; i < values.users.length; i++) {
        const user = values.users[i];
        const start_time = moment(user.time[0]).format("HH:mm");
        const end_time = moment(user.time[1]).format("HH:mm");
        shift_users.push({ ...user, time: [start_time, end_time] });
      }

      values.users = shift_users;
      values.place = current_place._id;

      await dispatch(
        call({
          url: `shifts/${current_shift._id}`,
          method: "PATCH",
          data: values,
        })
      );
      navigate("/cashier/main");
      dispatch(SET_APP(["current_shift"], null));
    } catch (e) {}
  };

  const getUsers = () => {
    const values = form.current.getFieldsValue();
    const unselected_users = _.filter(users, (o) => {
      const _users = values.users.map((o) => o.user);
      return o._id.indexOf(_users) !== -1;
    });
    return unselected_users;
  };

  return (
    <Modal
      okText="Сохранить"
      visible={isClosing}
      okButtonProps={{ disabled: loading }}
      cancelButtonProps={{ disabled: loading }}
      onCancel={onCancel}
      onOk={onSubmit}
      title="Рабочее время"
    >
      <Title level={5}>Отметьте сотрудников, которые отработали сегодня</Title>
      <Form layout="vertical" ref={form}>
        <Form.List name="users">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Row key={index}>
                  <Col span={24}>
                    <Space align="start">
                      <Form.Item
                        {...field}
                        label="Сотрудник"
                        key={`${index} ${field.key} user`}
                        name={[field.name, "user"]}
                        rules={[
                          {
                            required: true,
                            message: "Данное поле обязательно",
                          },
                        ]}
                      >
                        <Select disabled={loading} style={{ width: 150 }}>
                          {users &&
                            users.map((v) => (
                              <Select.Option key={v._id} value={v._id}>
                                {v.name}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="Время работы"
                        key={`${index} ${field.key} time`}
                        name={[field.name, "time"]}
                        rules={[
                          {
                            required: true,
                            message: "Данное поле обязательно",
                          },
                        ]}
                      >
                        <TimePicker.RangePicker
                          style={{ width: "100%" }}
                          format="HH:mm"
                          minuteStep={15}
                        />
                      </Form.Item>
                      <Form.Item label=" " {...field}>
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                          disabled={loading}
                        />
                      </Form.Item>
                    </Space>
                  </Col>
                </Row>
              ))}

              <Form.Item>
                <Button
                  type="primary"
                  onClick={() => add()}
                  disabled={loading}
                  icon={<PlusOutlined />}
                >
                  Добавить сотрудника
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ShiftUsers;
